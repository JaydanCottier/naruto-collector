import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const csvFile = path.join(__dirname, 'data', 'English_Naruto_KAYOU_Cardlist - Sheet4.csv');
const outJson = path.join(__dirname, 'src', 'content', 'cards', 'nrv01.json');

const csvData = fs.readFileSync(csvFile, 'utf8');
const lines = csvData.split('\n').map(l => l.trim()).filter(l => l.length > 0);

const headers = lines[0].split(',');

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const cards = [];
for (let i = 1; i < lines.length; i++) {
    // Simple CSV parse, assuming no commas in quoted fields for this specific file
    // Wait, let's check: 'Enter: Naruto Uzumaki! 1' -> doesn't look like it has quotes
    // 'A Dangerous Mission! Journey to the Land of Waves! 1' -> no commas.
    const fields = lines[i].split(',');
    const name = fields[0];
    const rarity = fields[1];
    const cardId = fields[2];
    const setId = fields[3];
    const region = fields[4];

    // Parse cardId e.g. NRV01-SE-001L5
    const match = cardId.match(/^([A-Z0-9]+)-([A-Z]+)-(\d+)(L\d+)?$/);

    let setPrefix = 'NRV01';
    let number = String(i).padStart(3, '0');
    let variantLevel = 'L1';

    if (match) {
        setPrefix = match[1];
        number = match[3];
        variantLevel = match[4] || '';
    }

    const id = `nrv01-${rarity.toLowerCase()}-${number}`;
    const slug = `${id}-${slugify(name)}`;

    cards.push({
        id: id,
        slug: slug,
        setId: 'nrv01',
        setSlug: 'nrv01',
        officialCode: 'NRV01',
        cardCode: `NRV01-${rarity}-${number}`,
        number: number,
        name: name,
        character: name.includes(' ') ? name.split(' ')[0] : name, // rough guess for character
        characterSlug: slugify(name.includes(' ') ? name.split(' ')[0] : name),
        rarity: rarity,
        type: 'character',
        image: `/images/cards/nrv01/${rarity.toLowerCase()}-${number}.jpg`,
        region: region,
        setPrefix: setPrefix,
        cardNumber: number,
        variantLevel: variantLevel,
        variantLevelDesc: variantLevel ? 'Standard' : '',
        cardSerial: cardId
    });
}

fs.writeFileSync(outJson, JSON.stringify(cards, null, 4), 'utf8');
console.log(`Generated ${cards.length} cards to ${outJson}`);
