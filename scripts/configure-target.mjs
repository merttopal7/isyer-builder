import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const TARGETS = {
  my: {
    key: 'my',
    productName: 'Isyer',
    displayTitle: 'İşyer',
    subtitle: 'Üyelik, QR Giriş ve Randevu',
    identifier: 'com.isyer.app',
    url: 'https://my.isyer.com',
    width: 1100,
    height: 780,
  },
  app: {
    key: 'app',
    productName: 'IsyerPanel',
    displayTitle: 'İşyer Panel',
    subtitle: 'İşletme Yönetimi ve Kapı Ekranı',
    identifier: 'com.isyer.panel',
    url: 'https://app.isyer.com',
    width: 1280,
    height: 820,
  },
};

const arg = (process.argv[2] || 'my').toLowerCase();
const chosen = TARGETS[arg] || TARGETS.my;

const confPath = path.join(rootDir, 'src-tauri', 'tauri.conf.json');
const conf = JSON.parse(fs.readFileSync(confPath, 'utf8'));

conf.productName = chosen.productName;
conf.identifier = chosen.identifier;
if (conf.app?.windows?.[0]) {
  conf.app.windows[0].title = chosen.displayTitle;
  conf.app.windows[0].width = chosen.width;
  conf.app.windows[0].height = chosen.height;
}
if (!conf.bundle) conf.bundle = {};
if (!conf.bundle.iOS) conf.bundle.iOS = {};
const envTeam = (process.env.APPLE_DEVELOPMENT_TEAM || '').trim();
conf.bundle.iOS.developmentTeam = envTeam || '0000000000';

fs.writeFileSync(confPath, `${JSON.stringify(conf, null, 2)}\n`, 'utf8');

const targetJsPath = path.join(rootDir, 'ui', 'target.js');
const targetJs = `window.ISYER_TARGET = ${JSON.stringify(
  {
    key: chosen.key,
    title: chosen.displayTitle,
    subtitle: chosen.subtitle,
    url: chosen.url,
  },
  null,
  2,
)};\n`;
fs.writeFileSync(targetJsPath, targetJs, 'utf8');

console.log(
  `[isyer-builder] Hedef yapılandırıldı: ${chosen.displayTitle} (${chosen.identifier}) -> ${chosen.url}`,
);

