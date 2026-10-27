<?php
/**
 * Przykład manifestu kluczy → kopiowany do THEME/inc/cmk-keys.php.
 * Generowany automatycznie przez tools/annotate.mjs (scope → klucz → podgląd tekstu).
 * Pełni rolę whitelisty: wtyczka przyjmie zapis tylko dla kluczy obecnych tutaj.
 *
 * Klucz = {scope}:{tag}:{hash8(widoczny tekst)}  (+ '#n' przy kolizji).
 *   scope = slug strony albo 'global' (komponenty współdzielone).
 */
return array(

	'home' => array(
		'home:h1:1a2b3c4d' => 'Pomoc prawna dopasowana do Ciebie',
		'home:p:5e6f7a8b'  => 'Od kilkunastu lat pomagamy ludziom i firmom…',
		'home:img:9c0d1e2f' => 'Zespół kancelarii',
	),

	'kontakt' => array(
		'kontakt:h1:aa11bb22' => 'Porozmawiajmy.',
		'kontakt:p:cc33dd44'  => 'Opisz krótko swoją sprawę…',
	),

	// Komponenty współdzielone (edycja raz = na wszystkich stronach).
	'global' => array(
		'global:h2:ee55ff66' => 'Masz sprawę? Nie zwlekaj.',
		'global:p:7788990a'  => 'W prawie czas często gra przeciwko Tobie…',
	),

);
