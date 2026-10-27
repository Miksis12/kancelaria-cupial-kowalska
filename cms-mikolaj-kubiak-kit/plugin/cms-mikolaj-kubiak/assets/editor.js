/* CMS-Mikołaj Kubiak — edycja „wprost na stronie". Ładowany tylko dla redaktora. */
(function () {
  'use strict';
  var CFG = window.CMK_EDIT || {};
  var params = new URLSearchParams(location.search);
  var inEdit = params.get('cmk_edit') === '1';

  var dirtyText = {};   // key -> innerHTML
  var dirtyImg = {};    // key -> { id, alt }
  var resetKeys = {};   // key -> true
  var dirty = false;
  var current = null;   // aktualnie edytowany element [data-cmk]
  var saveTimer = null;

  function api(path, body) {
    return fetch(CFG.rest + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': CFG.nonce },
      body: JSON.stringify(body || {})
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (d) { return { ok: r.ok, d: d }; }); });
  }

  function urlWith(edit, preview) {
    var u = new URL(location.href);
    edit ? u.searchParams.set('cmk_edit', '1') : u.searchParams.delete('cmk_edit');
    preview ? u.searchParams.set('cmk_preview', '1') : u.searchParams.delete('cmk_preview');
    return u.toString();
  }

  function toast(msg, kind) {
    var t = document.createElement('div');
    t.className = 'cmk-toast cmk-toast--' + (kind || 'ok');
    t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('is-in'); });
    setTimeout(function () { t.classList.remove('is-in'); setTimeout(function () { t.remove(); }, 300); }, 2200);
  }

  function markDirty() { dirty = true; var s = document.getElementById('cmk-state'); if (s) s.textContent = '● niezapisane'; }
  function markClean() { dirty = false; var s = document.getElementById('cmk-state'); if (s) s.textContent = 'zapisano'; }

  /* ---------- tryb podglądu (przycisk startowy) ---------- */
  function mountLaunch() {
    if (!CFG.editable) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'cmk-launch';
    b.innerHTML = '✎ Edytuj stronę' + (CFG.hasDraft ? ' <span class="cmk-dot" title="Masz niepublikowany szkic"></span>' : '');
    b.addEventListener('click', function () { location.href = urlWith(true, true); });
    document.body.appendChild(b);
  }

  /* Przeglądarki nie pozwalają postawić kursora w treści <button> (przycisk to jeden atomowy
     kontrolka) — więc nagłówek [data-cmk] wewnątrz przycisku-akordeonu (np. pytanie FAQ owinięte
     w <button>) byłby NIEEDYTOWALNY mimo contenteditable. W trybie edycji podmieniamy taki
     <button> na <div role="button"> (kopiujemy atrybuty + przenosimy dzieci), dzięki czemu
     zagnieżdżony nagłówek staje się edytowalny. Zmiana dotyczy WYŁĄCZNIE DOM edytora u redaktora
     — nic nie jest zapisywane (zapisujemy tylko innerHTML [data-cmk]) ani widziane przez gościa. */
  function liberateButtons() {
    document.querySelectorAll('button').forEach(function (btn) {
      if (!btn.querySelector('[data-cmk], [data-cmk-img]')) return;
      var div = document.createElement('div');
      Array.prototype.forEach.call(btn.attributes, function (a) {
        if (a.name.toLowerCase() === 'type') return; // type="submit/button" nie dotyczy <div>
        div.setAttribute(a.name, a.value);
      });
      if (!div.hasAttribute('role')) div.setAttribute('role', 'button');
      div.setAttribute('data-cmk-was-button', '1');
      while (btn.firstChild) div.appendChild(btn.firstChild);
      if (btn.parentNode) btn.parentNode.replaceChild(div, btn);
    });
  }

  /* W trybie edycji odsłaniamy treść ukrytą przez zwijane panele (akordeon FAQ, taby, „pokaż
     więcej"), żeby KAŻDY [data-cmk] był widoczny i klikalny — inaczej klient nie dosięgnie tekstu
     w zamkniętej karcie (a strony często nie mają JS przełączającego akordeon, albo klik w nagłówek
     stawia tylko kursor). Podnosimy tylko kontenery ze WSPÓŁWYSTĘPUJĄCYM overflow:hidden + skończonym
     max-height (sygnatura zwijania), więc nie ruszamy kadrów obrazów (overflow:hidden bez max-height).
     Dotyczy wyłącznie DOM edytora; przy wyjściu następuje przeładowanie/nawigacja, więc nie cofamy. */
  function revealHidden() {
    document.querySelectorAll('[data-cmk], [data-cmk-img]').forEach(function (el) {
      var node = el.parentElement;
      while (node && node !== document.body) {
        var cs = getComputedStyle(node);
        var clipsY = cs.overflowY === 'hidden' || cs.overflow.indexOf('hidden') !== -1;
        if (clipsY && cs.maxHeight !== 'none') {
          node.style.maxHeight = 'none';
          node.style.overflow = 'visible';
        }
        if (cs.display === 'none') node.style.display = 'block';
        if (node.hasAttribute('hidden')) node.removeAttribute('hidden');
        node = node.parentElement;
      }
    });
  }

  /* ---------- tryb edycji ---------- */
  function mountEditor() {
    document.body.classList.add('cmk-editing');
    try { document.execCommand('styleWithCSS', false, false); } catch (e) {} // bold/italic → <b>/<i>, nie style=""

    liberateButtons();  // odblokuj nagłówki uwięzione w <button> (akordeon)
    revealHidden();     // odsłoń treść zwiniętą w akordeonach/tabach

    document.querySelectorAll('[data-cmk]').forEach(function (el) {
      el.setAttribute('contenteditable', 'true');
      el.setAttribute('spellcheck', 'false');
      // dekoracyjne SVG (ikony/strzałki/scribble) = atomowe, nieedytowalne
      el.querySelectorAll('svg').forEach(function (s) { s.setAttribute('contenteditable', 'false'); });
      // linki tel:/mailto: wplecione w tekst = atomowe — edycja rozjechałaby widoczny
      // numer/e-mail z href, więc blokujemy ich edycję (href zostaje zachowany).
      el.querySelectorAll('a[href^="tel:"], a[href^="mailto:"]').forEach(function (a) { a.setAttribute('contenteditable', 'false'); });
      el.addEventListener('focus', function () { current = el; });
      el.addEventListener('input', function () {
        dirtyText[el.getAttribute('data-cmk')] = el.innerHTML;
        markDirty(); scheduleSave();
      });
      el.addEventListener('paste', function (e) {
        e.preventDefault();
        var txt = (e.clipboardData || window.clipboardData).getData('text/plain');
        document.execCommand('insertText', false, txt);
      });
    });

    document.querySelectorAll('[data-cmk-img]').forEach(function (img) {
      img.classList.add('cmk-img-editable');
      img.addEventListener('click', function (e) { e.preventDefault(); pickImage(img); });
    });

    buildBar();

    window.addEventListener('beforeunload', function (e) { if (dirty) { e.preventDefault(); e.returnValue = ''; } });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') exitEdit();
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') { e.preventDefault(); save(); }
    });
  }

  function buildBar() {
    var bar = document.createElement('div');
    bar.className = 'cmk-bar';
    bar.innerHTML =
      '<span class="cmk-bar-title">Tryb edycji</span>' +
      '<span class="cmk-grp">' +
        '<button data-cmd="bold" title="Pogrubienie (Ctrl+B)"><b>B</b></button>' +
        '<button data-cmd="italic" title="Kursywa (Ctrl+I)"><i>I</i></button>' +
        '<button data-cmd="link" title="Wstaw link">\u{1F517}</button>' +
        '<button data-cmd="reset" title="Przywróć oryginał tego fragmentu">↺</button>' +
      '</span>' +
      '<span id="cmk-state" class="cmk-state">zapisano</span>' +
      '<span class="cmk-spacer"></span>' +
      '<button class="cmk-b" data-act="save">Zapisz szkic</button>' +
      '<button class="cmk-b" data-act="preview">Podgląd</button>' +
      '<button class="cmk-b cmk-b--primary" data-act="publish">Publikuj</button>' +
      '<button class="cmk-b cmk-b--ghost" data-act="discard">Odrzuć szkic</button>' +
      '<button class="cmk-b cmk-b--ghost" data-act="exit">Wyjście</button>';
    document.body.appendChild(bar);

    // zachowaj zaznaczenie przy klikaniu w toolbar
    bar.querySelectorAll('[data-cmd]').forEach(function (b) {
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function () { onCmd(b.getAttribute('data-cmd')); });
    });
    bar.querySelectorAll('[data-act]').forEach(function (b) {
      b.addEventListener('click', function () { onAct(b.getAttribute('data-act')); });
    });
  }

  function onCmd(cmd) {
    if (cmd === 'reset') return resetCurrent();
    if (cmd === 'link') {
      var url = prompt('Adres linku (URL):', 'https://');
      if (url) document.execCommand('createLink', false, url);
    } else {
      document.execCommand(cmd, false, null);
    }
    if (current) { dirtyText[current.getAttribute('data-cmk')] = current.innerHTML; markDirty(); scheduleSave(); }
  }

  function onAct(act) {
    if (act === 'save') return save();
    if (act === 'preview') return location.href = urlWith(false, true);
    if (act === 'publish') return publish();
    if (act === 'discard') return discard();
    if (act === 'exit') return exitEdit();
  }

  function scheduleSave() { clearTimeout(saveTimer); saveTimer = setTimeout(function () { if (dirty) save(); }, 5000); }

  function save() {
    var payload = { postId: CFG.postId, text: dirtyText, img: dirtyImg, reset: Object.keys(resetKeys) };
    if (!payload.text && !payload.img && !payload.reset.length) return Promise.resolve();
    return api('content', payload).then(function (res) {
      if (res.ok && res.d && res.d.ok) { dirtyText = {}; dirtyImg = {}; resetKeys = {}; markClean(); toast('Szkic zapisany', 'ok'); }
      else { toast('Nie udało się zapisać szkicu', 'err'); }
      return res;
    }).catch(function () { toast('Błąd sieci przy zapisie', 'err'); });
  }

  function publish() {
    save().then(function () {
      api('publish', { postId: CFG.postId }).then(function (res) {
        if (res.ok && res.d && res.d.ok) { markClean(); toast('Opublikowano ✓', 'ok'); setTimeout(function () { location.href = urlWith(false, false); }, 700); }
        else { toast('Błąd publikacji', 'err'); }
      });
    });
  }

  function discard() {
    if (!confirm('Odrzucić wszystkie niepublikowane zmiany (szkic)?')) return;
    api('discard', { postId: CFG.postId }).then(function () { dirty = false; location.href = urlWith(true, true); });
  }

  function resetCurrent() {
    if (!current) { toast('Kliknij najpierw we fragment do przywrócenia', 'err'); return; }
    var key = current.getAttribute('data-cmk');
    if (!confirm('Przywrócić oryginalną treść tego fragmentu?')) return;
    resetKeys[key] = true; delete dirtyText[key]; markDirty();
    save().then(function () { location.reload(); });
  }

  function exitEdit() {
    if (dirty && !confirm('Masz niezapisane zmiany. Wyjść bez zapisu?')) return;
    location.href = urlWith(false, false);
  }

  function pickImage(img) {
    if (!window.wp || !wp.media) { toast('Biblioteka mediów niedostępna', 'err'); return; }
    var frame = wp.media({ title: 'Wybierz zdjęcie', button: { text: 'Użyj tego zdjęcia' }, multiple: false, library: { type: 'image' } });
    frame.on('select', function () {
      var a = frame.state().get('selection').first().toJSON();
      img.src = a.url; img.removeAttribute('srcset'); img.removeAttribute('sizes');
      dirtyImg[img.getAttribute('data-cmk-img')] = { id: a.id, alt: a.alt || '' };
      markDirty(); scheduleSave();
      toast('Zdjęcie zmienione — zapisz lub publikuj', 'ok');
    });
    frame.open();
  }

  /* ---------- start ---------- */
  if (!CFG.rest) return;
  if (inEdit && CFG.editable) mountEditor();
  else mountLaunch();
})();
