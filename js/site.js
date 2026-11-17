/* =========================================================================
   site.js — NAWIGACJA i STOPKA definiowane RAZ, wstrzykiwane na każdej stronie.
   Obsługuje też menu mobilne i odsłanianie treści przy scrollu ([data-odslon]).

   UŻYCIE na stronie:
     w <head>:  <script src="js/site.js" defer></script>   (po linku do styles.css)
     w <body>:  <div data-nav></div>      tuż po otwarciu <body>
                <div data-okruszki></div> okruszki w .naglowek-strony (podstrony)
                <div data-footer></div>   w miejscu stopki

   DODANIE POZYCJI MENU / ZMIANA DANYCH KONTAKTU = edycja TUTAJ (NAV / KONTAKT).
   Wchodzi od razu na wszystkich stronach. NIE wpisuj menu ani stopki do HTML.

   DWA TRYBY, jeden plik:
   · wersja plikowa (ten folder): HOME = 'index.html', linki to nazwy plików;
   · WordPress (motyw z tools/build-wp-theme.mjs): <script> ma atrybut
     data-home z adresem strony głównej. Wtedy linki `x.html` stają się
     adresami `HOME + x/`, bieżąca „strona" liczy się z adresu WP (tak, że
     `match` z nazwami plików działa bez zmian), a logo bierze się z katalogu
     motywu. Bez data-home nic się nie zmienia.
   ========================================================================= */
(function () {
  "use strict";

  var skrypt = document.currentScript;
  var WP = skrypt ? skrypt.getAttribute("data-home") : null;
  var HOME = WP || "index.html";
  /* w WP assets/ leży obok js/ w katalogu motywu */
  var ASSETS = WP ? skrypt.src.replace(/js\/site\.js(\?.*)?$/, "assets/") : "assets/";
  var here = WP ? plikZAdresu() : (location.pathname.split("/").pop() || "index.html");
  var onHome = (here === "" || here === "index.html");

  /* WP: /o-mnie/ → „o-mnie.html", strona główna → „index.html" */
  function plikZAdresu() {
    var baza = new URL(WP, location.href).pathname;
    var sciezka = location.pathname;
    var slug = sciezka.indexOf(baza) === 0 ? sciezka.slice(baza.length) : sciezka;
    slug = slug.replace(/^\/+|\/+$/g, "");
    return slug ? slug + ".html" : "index.html";
  }
  /* WP: „kontakt.html#x" → HOME + „kontakt/#x"; inne adresy bez zmian */
  function adresWP(href) {
    var m = /^([\w-]+)\.html(#.*)?$/.exec(href);
    if (!m) return href;
    return (m[1] === "index" ? HOME : HOME + m[1] + "/") + (m[2] || "");
  }

  /* ---------- Usługi: jedna lista na menu i na stopkę ----------
     Pozycje bez własnej podstrony prowadzą na razie do rejestru spraw na stronie
     głównej. Gdy powstanie kolejna, podmieniasz sam `href` i dodajesz `match`
     — wchodzi naraz w drop-down, w stopkę i w okruszki. */
  var USLUGI = [
    { label: "Rozwód i sprawy rodzinne",        href: "rozwod-i-sprawy-rodzinne.html", match: ["rozwod-i-sprawy-rodzinne.html"] },
    { label: "Sprawy spadkowe",                 href: "sprawy-spadkowe.html", match: ["sprawy-spadkowe.html"] },
    { label: "Jazda po alkoholu",               href: "jazda-po-alkoholu.html", match: ["jazda-po-alkoholu.html"] },
    { label: "Sprawy karne",                    href: "sprawy-karne.html", match: ["sprawy-karne.html"] },
    { label: "Sprawy cywilne",                  href: "sprawy-cywilne.html", match: ["sprawy-cywilne.html"] },
    /* Mediacje to zakładka niezależna: stoi w „Usługach", ale oddzielona hairline'em */
    { label: "Mediacje",                        href: "mediacje.html", match: ["mediacje.html"], oddzielona: true }
  ];

  /* ---------- Pozycje menu ----------
     href zaczynające się od '#' = sekcja na stronie głównej (na podstronach
     dostaje prefiks HOME). match = pliki, na których pozycja jest aktywna.
     Pozycja z tablicą `children` renderuje się jako drop-down. */
  var NAV = [
    { label: "Strona główna", href: HOME, match: ["index.html"] },
    { label: "Usługi",        children: USLUGI },
    { label: "O mnie",        href: "o-mnie.html", match: ["o-mnie.html"] },
    /* Zakładka z wpisami SCHOWANA do czasu prawdziwych wpisów (Mikołaj,
       27.10.2026): 12 pozycji prowadzi dziś do jednego przykładowego szablonu.
       Strona baza-wiedzy.html żyje dalej (noindex w generatorze motywu).
       Powrót = ta linia z powrotem w menu, druga w STOPKA_KANCELARIA i zdjęcie
       `noindex` w STRONY (tools/build-wp-theme.mjs). Etykieta „Baza wiedzy”,
       a nie „Aktualności”: treść evergreen nie starzeje się jak newsy.
       Szablon wpisu celowo NIE jest w menu — to plik do klonowania.
    { label: "Baza wiedzy",   href: "baza-wiedzy.html", match: ["baza-wiedzy.html"] }, */
    { label: "Kontakt",       href: "kontakt.html", match: ["kontakt.html"] }
  ];

  /* ---------- Jedyne źródło danych kontaktowych ---------- */
  var KONTAKT = {
    tel: "+48534477596",
    telTekst: "534 477 596",
    email: "kancelaria@cupial-kowalska.pl",
    firma: "Kancelaria Adwokacka Beata Cupiał-Kowalska",
    ulica: "ul. Kilińskiego 5 lok. 4",
    miasto: "42-202 Częstochowa",
    nip: "5771926637",  /* Biała lista MF, sprawdzone 21.09.2026 */
    izba: "Adwokat wpisana na listę Okręgowej Rady Adwokackiej w Częstochowie"
  };

  /* ---------- Linki stopki ---------- */
  var STOPKA_SPRAWY = USLUGI;
  var STOPKA_KANCELARIA = [
    { label: "O mnie", href: "o-mnie.html", match: ["o-mnie.html"] },
    /* { label: "Baza wiedzy", href: "baza-wiedzy.html", match: ["baza-wiedzy.html"] }, — schowana, zob. NAV */
    { label: "Pytania", href: "#pytania" },
    { label: "Kontakt", href: "kontakt.html", match: ["kontakt.html"] },
    { label: "Opinie w Google", href: "#" },
    { label: "Polityka prywatności", href: "polityka-prywatnosci.html", match: ["polityka-prywatnosci.html"] }
  ];

  /* ---------- Pomocnicze ---------- */
  function url(href) {
    /* samo "#" to placeholder — nie ma dokąd prowadzić, więc nie doklejamy HOME */
    if (href === "#") return "#";
    if (href.charAt(0) === "#") return onHome ? href : HOME + href;
    return WP ? adresWP(href) : href;
  }
  function aktywna(poz) {
    return !!(poz.match && poz.match.indexOf(here) !== -1);
  }
  function dzieckoAktywne(poz) {
    if (!poz.children) return false;
    for (var i = 0; i < poz.children.length; i++) {
      if (aktywna(poz.children[i])) return true;
    }
    return false;
  }
  function lista(pozycje) {
    return pozycje.map(function (p) {
      var a = aktywna(p) ? ' aria-current="page"' : "";
      var k = p.oddzielona ? ' class="oddzielona"' : "";
      return "<li" + k + '><a href="' + url(p.href) + '"' + a + ">" + p.label + "</a></li>";
    }).join("");
  }

  /* logo klientki (złote, PNG z przezroczystym tłem): sygnet w sześciokącie
     + nazwisko + „Adwokat" w jednym pliku. Nazwę czyta aria-label linku.
     Plik -955 to połowa oryginału (1910 px) uśredniana 2×2 — dokładnie
     pierwszy poziom mipmapy, który przeglądarka i tak by z oryginału
     zrobiła — zapisany jako PNG 8-bit (jeden kolor + alfa): 12 KB zamiast
     38 KB, a obraz zgodny z oryginałem przy gęstości ekranu 1–3 (sprawdzone
     zrzutami 12.11.2026). Oryginał zostaje w assets/ jako źródło. */
  function marka(opis) {
    return '<a class="marka" href="' + (onHome ? "#gora" : HOME) + '" aria-label="' + opis + '">'
      + '<img class="marka__logo" src="' + ASSETS + 'logo-cupial-kowalska-955.png" width="213" height="48" alt="">'
      + "</a>";
  }
  function ikonaTelefonu(rozmiar, grubosc) {
    return '<svg width="' + rozmiar + '" height="' + rozmiar + '" viewBox="0 0 24 24" fill="none" aria-hidden="true">'
      + '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.2 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" '
      + 'stroke="currentColor" stroke-width="' + grubosc + '" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  /* ---------- Nawigacja ---------- */
  function nawigacjaHTML() {
    var pozycje = NAV.map(function (p, i) {
      if (p.children) {
        var id = "podmenu-" + i;
        return '<div class="nav__grupa" data-rozwijane data-otwarte="nie">'
          +   '<button class="nav__rozwin" type="button" aria-expanded="false" aria-controls="' + id + '"'
          +     (dzieckoAktywne(p) ? ' data-aktywna="tak"' : "") + ">"
          +     p.label
          +     '<svg class="nav__strzalka" width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">'
          +       '<path d="M1 1l4 4 4-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
          +   "</button>"
          +   '<ul class="nav__podmenu" id="' + id + '">' + lista(p.children) + "</ul>"
          + "</div>";
      }
      var a = aktywna(p) ? ' aria-current="page"' : "";
      return '<a href="' + url(p.href) + '"' + a + ">" + p.label + "</a>";
    }).join("");

    return '<header class="nav" id="nawigacja">'
      + '<div class="kontener nav__wnetrze">'
      +   marka("Beata Cupiał-Kowalska, adwokat, strona główna")
      +   '<nav class="nav__menu" id="menu-glowne" aria-label="Nawigacja główna">'
      +     pozycje
      +     '<a class="nav__menu-tel" href="tel:' + KONTAKT.tel + '">' + KONTAKT.telTekst + "</a>"
      +   "</nav>"
      +   '<div class="nav__akcje">'
      +     '<a class="btn btn--obrys btn--maly" href="tel:' + KONTAKT.tel + '">'
      +       ikonaTelefonu(15, "1.7") + KONTAKT.telTekst
      +     "</a>"
      +     '<button class="nav__burger" id="burger" type="button" aria-label="Otwórz menu" aria-expanded="false" aria-controls="menu-glowne">'
      +       '<svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true"><path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" stroke-width="1.5"/></svg>'
      +     "</button>"
      +   "</div>"
      + "</div></header>";
  }

  /* ---------- Okruszki: ścieżka do strony głównej ----------
     Nazwę zakładki bierze z NAV — także z pozycji drop-downu „Usługi" — więc
     nowa podstrona dostaje okruszki sama z siebie, gdy tylko trafi do menu
     z `match`. Strona spoza menu może podać nazwę ręcznie:
     <div data-okruszki="Nazwa zakładki"></div>.
     Głębszą ścieżkę podaje ten sam atrybut, przez pionową kreskę:
     <div data-okruszki="Baza wiedzy|Tytuł wpisu"></div>. Krok, którego nazwa
     zgadza się z pozycją menu, sam staje się linkiem — dzięki temu wpis
     na blogu wraca do archiwum jednym kliknięciem, a w HTML wpisu stoi
     tylko jego własny tytuł.
     Rodzic drop-downu nie ma własnego adresu, więc w okruszkach nie jest
     linkiem — stoi jako nazwa grupy.

     Sam nie rysuje żadnego tła: wynik wkłada się do sekcji .naglowek-strony,
     która stoi w HTML, bo jej nagłówek i podtytuł są treścią danej podstrony. */
  /* adres pozycji menu o danej nazwie — potrzebny, gdy ścieżkę podaje HTML:
     krok, który nazywa się tak jak zakładka, ma być do niej linkiem */
  function adresZNav(label) {
    for (var i = 0; i < NAV.length; i++) {
      var p = NAV[i];
      if (p.label === label && p.href && p.href !== "#") return url(p.href);
      if (p.children) {
        for (var j = 0; j < p.children.length; j++) {
          var d = p.children[j];
          if (d.label === label && d.href && d.href !== "#") return url(d.href);
        }
      }
    }
    return null;
  }

  function sciezka(nazwaZHtml) {
    for (var i = 0; i < NAV.length; i++) {
      var p = NAV[i];
      if (aktywna(p)) return [{ label: p.label }];
      if (p.children) {
        for (var j = 0; j < p.children.length; j++) {
          if (aktywna(p.children[j])) return [{ label: p.label }, { label: p.children[j].label }];
        }
      }
    }
    if (!nazwaZHtml) return [];
    return nazwaZHtml.split("|").map(function (s) {
      var label = s.replace(/^\s+|\s+$/g, "");
      return { label: label, href: adresZNav(label) };
    }).filter(function (k) { return k.label !== ""; });
  }

  function okruszkiHTML(nazwaZHtml) {
    var kroki = sciezka(nazwaZHtml);
    /* na stronie głównej i na stronie spoza menu bez nazwy okruszki nie powstają */
    if (onHome || !kroki.length) return "";

    var pozycje = '<li><a href="' + HOME + '">Strona główna</a></li>';
    kroki.forEach(function (k, i) {
      var tresc;
      if (i === kroki.length - 1) {
        /* krok, na którym stoimy */
        tresc = '<span class="okruszki__tu" aria-current="page">' + k.label + "</span>";
      } else if (k.href) {
        /* krok pośredni o znanym adresie — np. archiwum nad wpisem */
        tresc = '<a href="' + k.href + '">' + k.label + "</a>";
      } else {
        /* nazwa grupy z drop-downu: rodzic nie ma własnego adresu */
        tresc = '<span class="okruszki__grupa">' + k.label + "</span>";
      }
      pozycje += "<li>" + tresc + "</li>";
    });

    return '<nav aria-label="Ścieżka nawigacji"><ol class="okruszki">' + pozycje + "</ol></nav>";
  }

  /* ---------- Stopka ---------- */
  function stopkaHTML() {
    var nip = KONTAKT.nip
      ? "NIP: " + KONTAKT.nip
      : 'NIP: <span class="todo" title="Do uzupełnienia przez klientkę: numer NIP kancelarii">do uzupełnienia</span>';

    return '<footer class="stopka biel">'
      + '<div class="kontener">'
      +   '<div class="stopka__siatka">'
      +     "<div>"
      +       marka("Beata Cupiał-Kowalska, adwokat")
      +       '<p class="stopka__opis">'
      +         KONTAKT.firma + "<br>"
      +         KONTAKT.ulica + ", " + KONTAKT.miasto + "<br>"
      +         '<a class="liczby" href="tel:' + KONTAKT.tel + '">' + KONTAKT.telTekst + "</a><br>"
      +         '<a href="mailto:' + KONTAKT.email + '">' + KONTAKT.email + "</a><br>"
      +         nip
      +       "</p>"
      +     "</div>"
      +     "<div><h3>Sprawy</h3><ul>" + lista(STOPKA_SPRAWY) + "</ul></div>"
      +     "<div><h3>Kancelaria</h3><ul>" + lista(STOPKA_KANCELARIA) + "</ul></div>"
      +   "</div>"
      +   '<div class="stopka__prawna">'
      +     "<span>© " + new Date().getFullYear() + " " + KONTAKT.firma + "</span>"
      +     "<span>" + KONTAKT.izba + "</span>"
      +     '<button type="button" class="stopka__cookies" data-zgoda-ustawienia>Ustawienia cookies</button>'
      +   "</div>"
      + "</div></footer>";
  }

  /* ---------- Menu mobilne ---------- */
  function menuMobilne() {
    var nav = document.getElementById("nawigacja");
    var burger = document.getElementById("burger");
    var menu = document.getElementById("menu-glowne");
    if (!nav || !burger || !menu) return;

    function ustawMenu(otwarte) {
      nav.setAttribute("data-menu", otwarte ? "otwarte" : "zamkniete");
      burger.setAttribute("aria-expanded", otwarte ? "true" : "false");
      burger.setAttribute("aria-label", otwarte ? "Zamknij menu" : "Otwórz menu");
    }
    ustawMenu(false);

    burger.addEventListener("click", function () {
      ustawMenu(nav.getAttribute("data-menu") !== "otwarte");
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) { ustawMenu(false); }
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.getAttribute("data-menu") === "otwarte") {
        ustawMenu(false);
        burger.focus();
      }
    });
  }

  /* ---------- Drop-down w menu ----------
     Na desktopie otwiera też hover i :focus-within (czysty CSS), tutaj jest
     klik — dla dotyku i dla klawiatury. Na wąskim ekranie to akordeon. */
  function rozwijane() {
    var grupy = document.querySelectorAll("[data-rozwijane]");
    if (!grupy.length) return;

    function ustaw(grupa, otwarte) {
      grupa.setAttribute("data-otwarte", otwarte ? "tak" : "nie");
      grupa.querySelector(".nav__rozwin").setAttribute("aria-expanded", otwarte ? "true" : "false");
    }
    function zamknijWszystkie(oprocz) {
      Array.prototype.forEach.call(grupy, function (g) { if (g !== oprocz) ustaw(g, false); });
    }

    Array.prototype.forEach.call(grupy, function (g) {
      g.querySelector(".nav__rozwin").addEventListener("click", function (e) {
        e.stopPropagation();
        var otwarte = g.getAttribute("data-otwarte") === "tak";
        zamknijWszystkie(g);
        ustaw(g, !otwarte);
      });
      /* wybór usługi zamyka listę (przy kotwicy na tej samej stronie nic się nie przeładuje) */
      g.querySelector(".nav__podmenu").addEventListener("click", function () { ustaw(g, false); });
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest("[data-rozwijane]")) zamknijWszystkie(null);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") zamknijWszystkie(null);
    });
  }

  /* ---------- Odsłanianie treści przy scrollu: raz, bez JS wszystko widoczne ---------- */
  function odslanianie() {
    var cele = document.querySelectorAll("[data-odslon]");
    var bezRuchu = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (bezRuchu || !("IntersectionObserver" in window)) {
      Array.prototype.forEach.call(cele, function (el) { el.classList.add("widoczne"); });
      return;
    }
    var io = new IntersectionObserver(function (wpisy) {
      wpisy.forEach(function (w) {
        if (w.isIntersecting) { w.target.classList.add("widoczne"); io.unobserve(w.target); }
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(cele, function (el) { io.observe(el); });
  }

  /* ---------- Filtr kategorii w archiwum wpisów ----------
     Ulepszenie, nie warunek działania: pozycje paska są zwykłymi linkami
     do grup, więc bez JS-a strona pokazuje wszystkie wpisy, a pasek działa
     jak spis kategorii. Tutaj kliknięcie zamienia się w zawężenie listy —
     chowamy CAŁE grupy, więc nagłówki kategorii zostają na swoich miejscach.
     Wejście z adresem `…#k-spadki` (np. z metryczki wpisu) od razu zawęża. */
  function filtrKategorii() {
    var pasek = document.querySelector("[data-filtr]");
    var archiwum = document.querySelector(".archiwum");
    if (!pasek || !archiwum) return;

    var grupy = archiwum.querySelectorAll(".archiwum__grupa");
    var pozycje = pasek.querySelectorAll(".filtr-kategorii__poz");
    if (!grupy.length || !pozycje.length) return;

    function istnieje(klucz) {
      for (var i = 0; i < grupy.length; i++) if (grupy[i].id === klucz) return true;
      return false;
    }

    function ustaw(klucz) {
      if (klucz !== "wszystkie" && !istnieje(klucz)) klucz = "wszystkie";
      Array.prototype.forEach.call(grupy, function (g) {
        g.hidden = !(klucz === "wszystkie" || g.id === klucz);
      });
      Array.prototype.forEach.call(pozycje, function (p) {
        if (p.getAttribute("data-kategoria") === klucz) p.setAttribute("aria-current", "true");
        else p.removeAttribute("aria-current");
      });
    }

    Array.prototype.forEach.call(pozycje, function (p) {
      p.addEventListener("click", function (e) {
        /* bez skoku: lista zawęża się w miejscu, pasek zostaje pod ręką */
        e.preventDefault();
        ustaw(p.getAttribute("data-kategoria"));
      });
    });

    /* linki spoza paska (karta najnowszego wpisu, metryczka wpisu) zmieniają
       tylko hasz — stąd nasłuch, żeby i one zawężały listę */
    window.addEventListener("hashchange", function () {
      ustaw(location.hash.replace("#", "") || "wszystkie");
    });

    ustaw(location.hash.replace("#", "") || "wszystkie");
  }

  /* ---------- Zgoda na pliki cookies (mapa Google) ----------
     Sama strona nie zapisuje cookies. Zapisać je może tylko osadzona mapa
     Google (strona główna i Kontakt), dlatego jej <iframe> ma w HTML
     data-src zamiast src (i atrybut hidden) — adres dostaje dopiero po zgodzie.
     Do tego czasu w miejscu mapy stoi zastępnik z przyciskiem „Pokaż mapę"
     (kliknięcie = zgoda) i zwykłym linkiem do Google Maps. Okienko pokazuje
     się, dopóki nie ma wyboru; przyciski „Zgadzam się" i „Nie zgadzam się"
     mają tę samą wagę. Wybór pamięta localStorage przez 12 miesięcy (to nie
     cookie, a bez tego trzeba by pytać na każdej podstronie); zmienia się go
     przyciskiem „Ustawienia cookies" w stopce. Ten przepływ opisuje polityka
     prywatności (#cookies, #google) — zmiana tutaj = zmiana tamtego tekstu. */
  var ZGODA_KLUCZ = "cupial-zgoda-cookies";
  var ZGODA_DNI = 365;
  var zgodaTeraz = null;      /* wybór z tej wizyty, gdy localStorage jest zablokowany */
  var zgodaWywolal = null;    /* przycisk w stopce, do którego wraca fokus */
  var MAPA_GOOGLE = "https://www.google.com/maps/search/?api=1&query="
    + encodeURIComponent("Kilińskiego 5, 42-202 Częstochowa");

  function zgodaOdczyt() {
    if (zgodaTeraz) return zgodaTeraz;
    try {
      var z = JSON.parse(localStorage.getItem(ZGODA_KLUCZ) || "null");
      if (z && typeof z.mapa === "boolean" && Date.now() - Date.parse(z.data) < ZGODA_DNI * 864e5) return z;
    } catch (e) { /* prywatne okno albo zablokowane dane strony */ }
    return null;
  }
  function zgodaZapisz(mapa) {
    zgodaTeraz = { mapa: mapa, data: new Date().toISOString() };
    try { localStorage.setItem(ZGODA_KLUCZ, JSON.stringify(zgodaTeraz)); } catch (e) { /* jw. */ }
  }

  function mapaZastepnikHTML() {
    return '<div class="mapa__zgoda">'
      + '<p class="mapa__zgoda-tekst"><b>Mapa dojazdu</b>'
      +   "Mapa Google może zapisać pliki cookies, dlatego wczytuje się dopiero po Twojej zgodzie.</p>"
      + '<p class="mapa__zgoda-akcje">'
      +   '<button type="button" class="btn btn--obrys btn--maly" data-zgoda-mapa>Pokaż mapę</button>'
      +   '<a class="link" href="' + MAPA_GOOGLE + '" target="_blank" rel="noopener">Otwórz w Google Maps</a>'
      + "</p></div>";
  }
  /* pokaz = true: iframe dostaje adres z data-src; false: pusta ramka + zastępnik */
  function mapy(pokaz) {
    [].forEach.call(document.querySelectorAll("iframe[data-src]"), function (f) {
      var zast = f.parentNode.querySelector(".mapa__zgoda");
      if (pokaz) {
        if (f.getAttribute("src") !== f.getAttribute("data-src")) f.setAttribute("src", f.getAttribute("data-src"));
        f.hidden = false;
        if (zast) zast.parentNode.removeChild(zast);
      } else {
        /* cofnięcie zgody: ramka przestaje rozmawiać z Google od razu */
        if (f.hasAttribute("src")) f.setAttribute("src", "about:blank");
        f.hidden = true;
        if (!zast) f.insertAdjacentHTML("afterend", mapaZastepnikHTML());
      }
    });
  }

  function zgodaPanelHTML(stan) {
    var obecny = stan ? (stan.mapa ? " Teraz mapa jest włączona." : " Teraz mapa jest wyłączona.") : "";
    return '<div class="zgoda-cookies" role="region" aria-label="Zgoda na pliki cookies" data-zgoda-panel>'
      + '<p class="zgoda-cookies__tytul">Pliki cookies</p>'
      + '<p class="zgoda-cookies__tekst">Strona sama nie zapisuje plików cookies. Może je zapisać tylko '
      +   "mapa Google z dojazdem do kancelarii, dlatego wczytuje się ona dopiero po Twojej zgodzie. "
      +   "Wybór zmienisz w każdej chwili w stopce strony." + obecny + " "
      +   '<a class="link" href="' + url("polityka-prywatnosci.html#cookies") + '">Polityka prywatności</a></p>'
      + '<div class="zgoda-cookies__akcje">'
      +   '<button type="button" class="btn btn--obrys btn--maly" data-zgoda="tak">Zgadzam się</button>'
      +   '<button type="button" class="btn btn--obrys btn--maly" data-zgoda="nie">Nie zgadzam się</button>'
      + "</div></div>";
  }
  function zgodaPokaz(zFokusem) {
    if (!document.querySelector("[data-zgoda-panel]")) {
      /* na początku <body>: klawiatura i czytnik trafiają na okienko przed menu */
      document.body.insertAdjacentHTML("afterbegin", zgodaPanelHTML(zgodaOdczyt()));
    }
    if (zFokusem) document.querySelector("[data-zgoda-panel] button").focus();
  }
  function zgodaZamknij() {
    var p = document.querySelector("[data-zgoda-panel]");
    if (p) p.parentNode.removeChild(p);
    if (zgodaWywolal) { zgodaWywolal.focus(); zgodaWywolal = null; }
  }
  function zgodaCookies() {
    var z = zgodaOdczyt();
    mapy(!!(z && z.mapa));
    if (!z) zgodaPokaz(false);
    document.addEventListener("click", function (e) {
      var t = e.target.closest && e.target.closest("[data-zgoda], [data-zgoda-mapa], [data-zgoda-ustawienia]");
      if (!t) return;
      if (t.hasAttribute("data-zgoda-ustawienia")) { zgodaWywolal = t; zgodaPokaz(true); return; }
      var tak = t.hasAttribute("data-zgoda-mapa") || t.getAttribute("data-zgoda") === "tak";
      zgodaZapisz(tak);
      mapy(tak);
      zgodaZamknij();
    });
  }

  function wstrzyknij() {
    var n = document.querySelector("[data-nav]");
    if (n) n.outerHTML = nawigacjaHTML();
    var o = document.querySelector("[data-okruszki]");
    /* pusty wynik znaczy „ta strona nie ma okruszków" — placeholder wtedy znika */
    if (o) o.outerHTML = okruszkiHTML(o.getAttribute("data-okruszki"));
    var s = document.querySelector("[data-footer]");
    if (s) s.outerHTML = stopkaHTML();
    menuMobilne();
    rozwijane();
    filtrKategorii();
    odslanianie();
    zgodaCookies();
  }

  /* klasa .js włącza stan początkowy [data-odslon] — zanim cokolwiek się pokaże */
  document.documentElement.classList.add("js");

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", wstrzyknij);
  else wstrzyknij();
})();
