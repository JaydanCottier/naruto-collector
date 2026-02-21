/**
 * generate-placeholders.mjs
 * Creates per-rarity SVG placeholder images.
 * Run: node scripts/generate-placeholders.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'images', 'placeholder');

const RARITIES = {
  r: { color: '#6b7280', label: 'R' },
  sr: { color: '#3b82f6', label: 'SR' },
  ssr: { color: '#8b5cf6', label: 'SSR' },
  tr: { color: '#06b6d4', label: 'TR' },
  hr: { color: '#ec4899', label: 'HR' },
  tgr: { color: '#14b8a6', label: 'TGR' },
  nr: { color: '#34d399', label: 'NR' },
  zr: { color: '#f97316', label: 'ZR' },
  gp: { color: '#fbbf24', label: 'GP' },
  bp: { color: '#64748b', label: 'BP' },
  cp: { color: '#f59e0b', label: 'CP' },
  cr: { color: '#f472b6', label: 'CR' },
  or: { color: '#f97316', label: 'OR' },
  ar: { color: '#a855f7', label: 'AR' },
  ptr: { color: '#f97316', label: 'PTR' },
  qr: { color: '#a78bfa', label: 'QR' },
  ur: { color: '#f59e0b', label: 'UR' },
  mr: { color: '#c084fc', label: 'MR' },
  pu: { color: '#e879f9', label: 'PU' },
  lr: { color: '#fcd34d', label: 'LR' },
  sp: { color: '#ef4444', label: 'SP' },
  se: { color: '#f59e0b', label: 'SE' },
  pr: { color: '#94a3b8', label: 'PR' },
  slr: { color: '#f97316', label: 'SLR', gradient: true },
  scr: { color: '#f59e0b', label: 'SCR', gradient: true },
  sv: { color: '#a855f7', label: 'SV', gradient: true },
  xr: { color: '#3b82f6', label: 'XR', gradient: true },
};

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

for (const [key, info] of Object.entries(RARITIES)) {
  const bgFill = info.gradient
    ? `<defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style="stop-color:#f97316"/><stop offset="33%" style="stop-color:#ec4899"/><stop offset="66%" style="stop-color:#8b5cf6"/><stop offset="100%" style="stop-color:#3b82f6"/></linearGradient></defs><rect width="200" height="280" rx="12" fill="url(#g)" opacity="0.15"/>`
    : `<rect width="200" height="280" rx="12" fill="${info.color}" opacity="0.15"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
  ${bgFill}
  <rect width="200" height="280" rx="12" fill="none" stroke="${info.color}" stroke-width="1" opacity="0.3"/>
  <text x="100" y="130" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="900" font-size="32" fill="${info.color}" opacity="0.6">${info.label}</text>
  <text x="100" y="160" text-anchor="middle" font-family="system-ui, sans-serif" font-weight="600" font-size="11" fill="${info.color}" opacity="0.4">KAYOU NARUTO</text>
  <rect x="70" y="180" width="60" height="4" rx="2" fill="${info.color}" opacity="0.2"/>
</svg>`;

  fs.writeFileSync(path.join(OUTPUT_DIR, `${key}.svg`), svg);
}

console.log(`Generated ${Object.keys(RARITIES).length} placeholder SVGs in ${OUTPUT_DIR}`);
