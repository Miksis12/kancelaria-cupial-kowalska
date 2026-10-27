// wdroz-motyw.mjs — przebudowa motywu i wgranie go na serwer produkcyjny (VPS).
//
//     node tools/wdroz-motyw.mjs
//
// PO CO. Od 27.10.2026 strona żyje na VPS-ie i tam klientka poprawia treść
// w edytorze CMK. Zmiana w HTML, styles.css albo site.js = ten skrypt:
// buduje motyw generatorem (tools/build-wp-theme.mjs) do katalogu
// tymczasowego, wysyła go aliasem SSH `cupial-vps-root` (~/.ssh/config),
// sprawdza składnię PHP i dopiero wtedy podmienia katalog motywu.
// Baza WordPressa — w tym poprawki treści klientki — nie jest ruszana.
// Poprzednia wersja motywu zostaje w /root/motyw-poprzedni na serwerze
// (cofnięcie: zamienić katalogi miejscami).

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const SERWER = 'cupial-vps-root';
const MOTYWY = '/var/www/cupial-kowalska/wp-content/themes';

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cupial-motyw-'));
// scp bierze „C:\…" za nazwę hosta — dlatego tar i scp działają na
// ścieżkach względnych w katalogu tymczasowym.
const uruchom = (cmd, args) => execFileSync(cmd, args, { stdio: 'inherit', cwd: tmp });

try {
  uruchom(process.execPath, [path.join(ROOT, 'tools', 'build-wp-theme.mjs'), path.join(tmp, 'cupial-kowalska')]);
  uruchom('tar', ['-czf', 'motyw.tgz', 'cupial-kowalska']);
  uruchom('scp', ['-q', 'motyw.tgz', `${SERWER}:/root/motyw.tgz`]);
  uruchom('ssh', [SERWER, `set -e
rm -rf /root/motyw-nowy && mkdir /root/motyw-nowy
tar --no-same-owner -xzf /root/motyw.tgz -C /root/motyw-nowy
for f in $(find /root/motyw-nowy -name '*.php'); do php -l "$f" >/dev/null; done
chown -R www-data:www-data /root/motyw-nowy/cupial-kowalska
rm -rf /root/motyw-poprzedni
mv ${MOTYWY}/cupial-kowalska /root/motyw-poprzedni
mv /root/motyw-nowy/cupial-kowalska ${MOTYWY}/cupial-kowalska
rm -rf /root/motyw-nowy /root/motyw.tgz
echo "Motyw podmieniony na serwerze. Poprzedni: /root/motyw-poprzedni"`]);
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
