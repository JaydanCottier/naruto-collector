import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rarities = [
    'R', 'SR', 'SSR', 'TR', 'HR', 'TGR', 'ZR', 'UR', 'OR', 'AR', 'SLR',
    'SP', 'CP', 'GP', 'MR', 'CR', 'NR', 'BP', 'SE', 'SCR', 'PTR', 'QR',
    'XR', 'PR', 'LR', 'PU', 'SV'
];

const colorMap = {
    R: '#71717a',      // flat grey
    SR: '#3b82f6',     // blue
    SSR: '#8b5cf6',    // purple
    TR: '#ec4899',     // hot pink / magenta
    HR: '#ec4899',     // hot pink / magenta
    CR: '#ec4899',     // hot pink / magenta
    TGR: '#14b8a6',    // teal
    NR: '#14b8a6',     // teal
    ZR: '#f97316',     // bright orange
    PTR: '#f97316',    // bright orange
    UR: '#f59e0b',     // gold / amber
    SE: '#f59e0b',     // gold / amber
    CP: '#f59e0b',     // gold / amber
    GP: '#f59e0b',     // gold / amber
    OR: '#dc2626',     // deep red
    SP: '#dc2626',     // deep red
    AR: '#6d28d9',     // violet
    QR: '#6d28d9',     // violet
    MR: '#6d28d9',     // violet
    PU: '#6d28d9',     // violet
    BP: '#334155',     // dark slate
    LR: '#d97706',     // amber glow
    SLR: 'rainbow',
    SCR: 'rainbow',
    XR: 'rainbow',
    SV: 'rainbow',
    PR: 'rainbow'
};

const outDir = path.join(__dirname, 'public', 'images', 'placeholder');

if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
}

let generated = 0;

for (const rarity of rarities) {
    const color = colorMap[rarity] || '#71717a';

    let fillDef = '';
    let fillAttr = '';

    if (color === 'rainbow') {
        fillDef = `
  <defs>
    <linearGradient id="rainbow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f97316" />
      <stop offset="33%" stop-color="#ec4899" />
      <stop offset="66%" stop-color="#8b5cf6" />
      <stop offset="100%" stop-color="#3b82f6" />
    </linearGradient>
  </defs>`;
        fillAttr = 'fill="url(#rainbow)"';
    } else {
        fillAttr = `fill="${color}"`;
    }

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="280" viewBox="0 0 200 280">
${fillDef}
  <rect width="200" height="280" rx="12" ${fillAttr}/>
  <rect x="8" y="8" width="184" height="264" rx="10" fill="none" stroke="white" stroke-opacity="0.2" stroke-width="2"/>
  <text x="100" y="130" text-anchor="middle" font-family="Bangers, sans-serif" font-weight="bold" font-size="52" fill="white" opacity="0.9">${rarity}</text>
  <text x="100" y="175" text-anchor="middle" font-family="sans-serif" font-size="28" fill="white" opacity="0.5">?</text>
  <text x="100" y="240" text-anchor="middle" font-family="sans-serif" font-size="11" fill="white" opacity="0.4">Image coming soon</text>
</svg>`;

    fs.writeFileSync(path.join(outDir, `${rarity.toLowerCase()}.svg`), svg);
    generated++;
}

console.log(`Generated ${generated} SVG placeholders.`);
