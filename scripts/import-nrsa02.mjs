import fs from 'fs';
import path from 'path';

const csvContent = fs.readFileSync(path.join(process.cwd(), 'data', 'English_Naruto_KAYOU_Cardlist - Sheet5.csv'), 'utf8');

const lines = csvContent.split('\n').filter(l => l.trim() !== '');
const headers = lines[0].split(',').map(h => h.trim());

const cards = [];

const slugify = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

for (let i = 1; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Handle potential commas in fields by just simple splitting for this specific file, no quotes used in this file
    const parts = rawLine.split(',');

    const name = parts[0].trim();
    const rarity = parts[1].trim();
    const cardId = parts[2].trim();
    const setIdFromCsv = parts[3].trim();

    // cardId e.g. NRSA02-SE-001L5
    // let's parse the number
    const prefixAndRarity = `NRSA02-${rarity}-`;
    let numberPart = cardId.replace(prefixAndRarity, '');
    let cardNumber = numberPart;
    // extract digits for number if possible
    const match = numberPart.match(/^(\d+)/);
    let justNumber = match ? match[1] : numberPart;

    let charSlug = '';
    if (!name.startsWith('NRSA02-') && !name.startsWith('Chunin') && !name.startsWith('Start Your') && !name.startsWith('The Tenth') && !name.startsWith('The Chunin') && !name.startsWith("Naruto's") && !name.startsWith('Bushy Brow') && !name.startsWith('Sakura') && !name.startsWith('Battle Formation') && !name.startsWith('Clone') && !name.startsWith('Kunoichi') && !name.startsWith('Akamaru')) {
        charSlug = slugify(name);
    } else {
        charSlug = justNumber;
    }

    const isPromo = false;

    // Handle specific R-rarity scene names as descriptions or leave them as names
    let cleanName = name;
    if (cleanName.startsWith('NRSA02-')) {
        cleanName = 'Unknown Character';
    }

    const cardData = {
        id: `nrsa02-${rarity.toLowerCase()}-${justNumber}`,
        slug: `nrsa02-${rarity.toLowerCase()}-${justNumber}-${slugify(cleanName)}`,
        setId: 'nrsa02',
        setSlug: 'nrsa02',
        number: justNumber,
        name: cleanName,
        rarity: rarity,
        type: cleanName.includes('Challenge') || cleanName.includes('Start Your Engines') || cleanName.includes('The Tenth Question') || cleanName.includes('The Chunin Exam') || cleanName.includes('Naruto\'s Counterattack') || cleanName.includes('Bushy Brow\'s Pledge') || cleanName.includes('Sakura Blossoms') || cleanName.includes('Battle Formation') || cleanName.includes('Clone vs. Clone') || cleanName.includes('Bushy Brow\'s Jealousy') || cleanName.includes('Kunoichi Rumble') || cleanName.includes('Akamaru Unleashed') ? 'Scene' : 'Character',
        character: cleanName !== 'Unknown Character' && !cleanName.includes('Challenge') ? cleanName : null,
        arc: "Chunin Exams",
        image: `/images/cards/nrsa02-${rarity.toLowerCase()}-${justNumber}.jpg`,
        description: "",
        variant: null,
        serialLimit: null,
        isPromo: isPromo,
        characterSlug: charSlug !== justNumber ? charSlug : null,
        region: "GLOBAL",
        setPrefix: "NRSA02",
        cardNumber: cardNumber,
        cardSerial: cardId
    };

    cards.push(cardData);
}

fs.writeFileSync(path.join(process.cwd(), 'src', 'content', 'cards', 'nrsa02.json'), JSON.stringify(cards, null, 4));
console.log(`Generated ${cards.length} cards!`);
