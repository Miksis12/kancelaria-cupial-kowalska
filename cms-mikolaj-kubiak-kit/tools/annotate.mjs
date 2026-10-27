// annotate.mjs — owija edytowalne elementy w wywołania cmk_block()/cmk_img().
//
// Wejście: HTML body PO transformacji (zawiera już `<?php echo … ?>` z linków/assetów).
// Wyjście: { html, keys } — html z elementami owiniętymi:
//     <?php cmk_block('klucz', function () { ?>…ORYGINALNY ELEMENT…<?php }); ?>
// Forma z domknięciem (closure) sprawia, że dynamiczne `<?php echo … ?>` w środku
// nadal się wykonują przy renderze defaultu (a fallback w motywie po prostu odpala closure).
//
// Klucz = {scope}:{tag}:{hash8(widoczny tekst)}  (+ '#n' przy kolizji identycznych tekstów).
//   scope = 'global' dla elementów w sekcji `.section--cta` (edycja raz = wszędzie),
//           w przeciwnym razie slug strony.
// Bajty oryginału są zachowane 1:1 (wycinamy z oryginalnego stringa, nie re-serializujemy).

import { createHash } from 'node:crypto';

// Tagi „blokowe" (proza): owijane w całości razem z inline <span>/<a>/<em>.
const BLOCK_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'blockquote',
  'figcaption', 'dt', 'dd', 'th', 'td', 'caption', 'summary']);
// Tagi „liściowe"/kontenerowe: owijane TYLKO gdy są liściem tekstowym (bez zagnieżdżonych
// kandydatów) — inaczej schodzimy w głąb, do najmniejszego elementu niosącego tekst.
const LEAF_TAGS = new Set(['span', 'div']);
// Inline tekstowe używane jako SAMODZIELNE nagłówki/etykiety (np. tytuł karty zapisany jako
// <strong style="display:block">…</strong> zamiast <h3>). Owijane jak liść — tylko gdy trafimy
// na nie samodzielnie (rodzic zszedł w głąb z innego powodu) i nie zawierają zagnieżdżonych
// kandydatów. ŚWIADOMIE nie ma ich w NESTED_CANDIDATE_RE: dzięki temu <strong> WPLECIONE w prozę
// (<p>… <strong>x</strong> …</p> lub <a>Czytaj <strong>więcej</strong></a>) nie rozbija owijania
// rodzica — całość owija się razem, a osobno owijamy tylko element stojący samodzielnie.
const INLINE_LEAF_TAGS = new Set(['strong', 'b', 'em', 'i', 'u', 's', 'mark', 'small',
  'cite', 'q', 'code', 'abbr', 'dfn', 'time', 'label', 'address', 'ins', 'del',
  'sub', 'sup', 'kbd', 'samp', 'var', 'output', 'data']);
const VOID_TAGS = new Set(['img']);
// Zagnieżdżony blok (proza) → blok-rodzic schodzi w głąb (np. <li> z <p>).
const NESTED_BLOCK_RE = /<(?:h[1-6]|p|li|blockquote|figcaption|dt|dd|th|td|caption|summary)\b/i;
// Dowolny zagnieżdżony kandydat z tekstem → kontener/anchor schodzi w głąb.
// `button` włączone, by NIE owijać grup przycisków (np. pille „Sprawa dotyczy") — kontener
// z <button> schodzi w głąb, a same <button> pozostają nieedytowalne w źródle (edytor
// odblokowuje edycję nagłówka w przycisku po stronie przeglądarki — patrz editor.js).
const NESTED_CANDIDATE_RE = /<(?:h[1-6]|p|li|blockquote|figcaption|dt|dd|th|td|caption|summary|div|span|a|img|button)\b/i;

// --- Konfiguracja (dostosuj per projekt) ---
const BLOCK_FN = 'cmk_block';            // nazwa helpera PHP dla tekstu
const IMG_FN = 'cmk_img';                // nazwa helpera PHP dla obrazów
const GLOBAL_SELECTOR = 'section--cta';  // klasa sekcji „globalnej" (edycja raz = wszędzie)

function hash8(s) { return createHash('sha1').update(s, 'utf8').digest('hex').slice(0, 8); }

function stripToText(html) {
  return html
    .replace(/<\?php[\s\S]*?\?>/g, ' ')   // dynamiczne wstawki PHP
    .replace(/<[^>]+>/g, ' ')             // tagi
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

// Indeks PO '>' otwierającego tagu zaczynającego się na pos. Szanuje cudzysłowy.
function endOfOpenTag(s, pos) {
  let i = pos + 1, q = null;
  while (i < s.length) {
    const c = s[i];
    if (q) { if (c === q) q = null; i++; continue; }
    if (c === '"' || c === "'") { q = c; i++; continue; }
    if (c === '>') return i + 1;
    i++;
  }
  return -1;
}

// Indeks PO </tag> elementu (z liczeniem zagnieżdżeń tego samego tagu). start = '<' otwierającego.
function endOfElement(s, start, tag) {
  const openEnd = endOfOpenTag(s, start);
  if (openEnd === -1) return -1;
  if (s[openEnd - 2] === '/') return openEnd;            // self-closing
  const lc = tag.toLowerCase();
  const openRe = new RegExp('^<' + lc + '([\\s/>])', 'i');
  const closeRe = new RegExp('^</' + lc + '\\s*>', 'i');
  let depth = 1, i = openEnd;
  while (i < s.length) {
    if (s.startsWith('<!--', i)) { const e = s.indexOf('-->', i); i = e === -1 ? s.length : e + 3; continue; }
    if (s[i] === '<') {
      const win = s.slice(i, i + lc.length + 4);
      const cm = closeRe.exec(win);
      if (cm) { depth--; const e = i + cm[0].length; if (depth === 0) return e; i = e; continue; }
      if (openRe.test(win)) { const oe = endOfOpenTag(s, i); if (oe === -1) return -1; if (s[oe - 2] !== '/') depth++; i = oe; continue; }
      const oe = endOfOpenTag(s, i); i = oe === -1 ? s.length : oe; continue;
    }
    i++;
  }
  return -1;
}

function openTagOf(el) { const gt = el.indexOf('>'); return gt === -1 ? el : el.slice(0, gt + 1); }
function innerOf(el) {
  const gt = el.indexOf('>'); const lc = el.lastIndexOf('</');
  if (gt === -1 || lc === -1 || lc < gt) return '';
  return el.slice(gt + 1, lc);
}

// Zakresy [start,end) sekcji globalnych (.section--cta) — elementy w środku → klucz global.
function globalRanges(body) {
  const ranges = [];
  const re = new RegExp('<section\\b[^>]*\\b' + GLOBAL_SELECTOR + '\\b[^>]*>', 'gi');
  let m;
  while ((m = re.exec(body))) {
    const end = endOfElement(body, m.index, 'section');
    if (end !== -1) ranges.push([m.index, end]);
  }
  return ranges;
}

// Anchor tel:/mailto: — jego edycja rozjeżdża widoczny numer/e-mail z href, więc
// jest w całości nieedytowalny (sprawdzane w pętli PRZED schodzeniem w głąb).
function isTelOrMailto(open) {
  return /\bhref\s*=\s*["']\s*(?:tel:|mailto:)/i.test(open);
}

// Zmienne PHP, do których odwołuje się owijany element (tylko wewnątrz wstawek `<?php … ?>`).
// Domknięcie NIE dziedziczy zasięgu szablonu, więc trzeba je przechwycić przez `use (...)`,
// inaczej byłyby puste — np. <img src="<?php echo $t; ?>/assets/…"> wyszłoby jako src="/assets/…"
// (root domeny) → 404. Przechwytujemy WARUNKOWO (tylko realnie użyte), by na motywach bez danej
// zmiennej nie generować `Undefined variable`. Superglobale i $this pomijamy (są dostępne wszędzie).
const SKIP_VARS = new Set(['$this', '$GLOBALS', '$_GET', '$_POST', '$_REQUEST', '$_SERVER',
  '$_SESSION', '$_COOKIE', '$_FILES', '$_ENV']);
function captureVars(el) {
  const found = new Set();
  const php = el.match(/<\?php[\s\S]*?\?>/g) || [];
  const re = /\$[a-zA-Z_]\w*/g;
  for (const chunk of php) {
    let m;
    while ((m = re.exec(chunk))) { if (!SKIP_VARS.has(m[0])) found.add(m[0]); }
  }
  return [...found];
}

function decide(el, tag) {
  const open = openTagOf(el);
  if (/\saria-hidden\s*=\s*["']true["']/i.test(open)) return { wrap: false };

  if (tag === 'img') {
    const alt = (/\balt="([^"]*)"/i.exec(open) || [, ''])[1];
    const name = (/assets\/(?:img\/)?([^"'?\s]+)/i.exec(el) || [, ''])[1];
    return { wrap: true, fp: 'img|' + alt + '|' + name, preview: (alt || name || 'obraz').slice(0, 60) };
  }

  const text = stripToText(innerOf(el));
  if (!text) return { wrap: false };
  return { wrap: true, fp: text, preview: text.slice(0, 60) };
}

export function annotate(body, slug) {
  const globals = globalRanges(body);
  const inGlobal = (pos) => globals.some(([a, b]) => pos >= a && pos < b);
  const keys = [];
  const used = Object.create(null);
  let out = '', i = 0;

  while (i < body.length) {
    const lt = body.indexOf('<', i);
    if (lt === -1) { out += body.slice(i); break; }
    out += body.slice(i, lt);

    const om = /^<([a-zA-Z][a-zA-Z0-9]*)/.exec(body.slice(lt, lt + 24));
    if (!om) { out += '<'; i = lt + 1; continue; }
    const tag = om[1].toLowerCase();
    const isBlock = BLOCK_TAGS.has(tag);
    const isLeaf = LEAF_TAGS.has(tag);              // span/div — owijane tylko jako liść tekstowy
    const isInlineLeaf = INLINE_LEAF_TAGS.has(tag); // strong/em/label/… — jw., samodzielne nagłówki/etykiety
    const isImg = tag === 'img';
    const isAnchor = tag === 'a';

    if (isBlock || isLeaf || isInlineLeaf || isImg || isAnchor) {
      const end = VOID_TAGS.has(tag) ? endOfOpenTag(body, lt) : endOfElement(body, lt, tag);
      if (end === -1) { out += '<'; i = lt + 1; continue; }
      const el = body.slice(lt, end);
      const open = openTagOf(el);
      const inner = isImg ? '' : innerOf(el);

      // (1) tel:/mailto: — cały anchor bez zmian; nie owijaj i NIE schodź w głąb
      //     (numer/e-mail w zagnieżdżonym <span> też pozostaje nietykalny).
      if (isAnchor && isTelOrMailto(open)) { out += el; i = end; continue; }

      // (2) Schodzenie w głąb do najmniejszego elementu z tekstem:
      //     - blok (proza): schodzimy TYLKO gdy zawiera zagnieżdżony blok (np. <li> z <p>),
      //       inline <span>/<a>/<em> zostają w środku i akapit owijamy w całości;
      //     - kontener/liść (div/span) i anchor: schodzimy gdy zawiera dowolnego kandydata z tekstem.
      if (isBlock) {
        if (NESTED_BLOCK_RE.test(inner)) { out += '<'; i = lt + 1; continue; }
      } else if (isLeaf || isInlineLeaf || isAnchor) {
        if (NESTED_CANDIDATE_RE.test(inner)) { out += '<'; i = lt + 1; continue; }
      }

      const dec = decide(el, tag);
      if (dec.wrap) {
        const scope = inGlobal(lt) ? 'global' : slug;
        let key = scope + ':' + tag + ':' + hash8(dec.fp);
        if (used[key] != null) { used[key]++; key += '#' + used[key]; } else used[key] = 0;
        keys.push({ key, global: scope === 'global', preview: dec.preview });
        const fn = isImg ? IMG_FN : BLOCK_FN;
        // `use (...)` — przechwytujemy zmienne PHP użyte w środku (patrz captureVars): najczęściej
        // $t = get_template_directory_uri() dla obrazów. Bez tego domknięcie widziałoby je puste.
        const vars = captureVars(el);
        const use = vars.length ? ` use (${vars.join(', ')})` : '';
        // Dodatkowy '\n' po `?>` — PHP zje DOKŁADNIE ten jeden, więc oryginalny
        // odstęp/nowa linia za elementem zostaje zachowany (render bajt-w-bajt).
        out += `<?php ${fn}('${key}', function ()${use} { ?>${el}<?php }); ?>\n`;
        i = end; continue;
      }
      out += el; i = end; continue;
    }

    out += '<'; i = lt + 1;
  }

  return { html: out, keys };
}
