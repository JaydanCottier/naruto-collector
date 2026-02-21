import fs from 'fs';
import path from 'path';

const csvPath = 'English_Naruto_KAYOU_Cardlist - English_Naruto_KAYOU_Cardlist.csv';
const csvData = fs.readFileSync(csvPath, 'utf8');
const rows = csvData.trim().split('\n').map(row => row.trim());

// Remove header
const header = rows.shift(); // Name,Rarity,Card_ID,Set,Set_Name

const setsMap = {};
const cardsMap = {};
const promoCards = [];

function generateSlug(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

rows.forEach(row => {
    if (!row) return;
    const parts = row.split(',');
    // If a name contains a comma, this simple split would break, but looking at the CSV, names like "Enter: Naruto Uzumaki! 1" don't contain commas.
    // Wait, let's join back if length > 5
    if (parts.length > 5) {
        // Find the last 4 elements which are Rarity, Card_ID, Set, Set_Name
        // Then join the rest for the name
    }
    const name = parts.slice(0, parts.length - 4).join(',');
    const rarity = parts[parts.length - 4];
    const cardId = parts[parts.length - 3];
    const setCode = parts[parts.length - 2];
    const setName = parts[parts.length - 1];

    const isPromo = setCode === 'Promo' || cardId.includes('-PR-');

    if (isPromo) {
        promoCards.push({ name, rarity, cardId, setCode, setName });
        return;
    }

    if (!setsMap[setCode]) {
        setsMap[setCode] = {
            id: setCode.toLowerCase(),
            slug: setCode.toLowerCase(),
            officialCode: setCode,
            name: setName,
            displayName: setName,
            tier: "EN",
            wave: parseInt(setCode.replace('NRSA', '')),
            series: "English",
            type: "booster",
            language: "EN",
            releaseDate: "2024-01-01", // Placeholder
            cardCount: 0,
            packCount: 36,
            packContents: "5 cards per pack",
            description: `KAYOU Naruto ${setName}`,
            logoImage: `/images/sets/${setCode.toLowerCase()}-logo.png`,
            bannerImage: `/images/sets/${setCode.toLowerCase()}-banner.jpg`,
            caseSize: { regular: 36 },
            boxVariants: null,
            cardBreakdown: {},
            retailAvailability: ["hobby"],
            unsealed: false,
            affiliateLinks: { ebay: "PLACEHOLDER", approxPriceUSD: 30, approxPriceCNY: 0 }
        };
        cardsMap[setCode] = [];
    }

    // Parse Card
    // Example: Card_ID = NRSA01-SE-001L5
    // number: SE-001L5
    const number = cardId.replace(`${setCode}-`, '');

    // Character guess: name without numbers or exclamation marks?
    // Actually, "Enter: Naruto Uzumaki! 1" features characters. We'll just use the full name if we can't tell, 
    // but the CSV "Name" is actually the Character name for higher rarities (e.g. "Sasuke Uchiha"),
    // and for base cards (R), it's the scene name.
    const isScene = rarity === 'R';
    const character = isScene ? 'Various' : name;

    cardsMap[setCode].push({
        id: cardId.toLowerCase(),
        slug: cardId.toLowerCase(),
        setId: setCode.toLowerCase(),
        setSlug: setCode.toLowerCase(),
        officialCode: setCode,
        cardCode: cardId,
        number: number,
        name: name,
        rarity: rarity,
        type: "card",
        character: character,
        characterSlug: generateSlug(character),
        image: `/images/cards/${setCode.toLowerCase()}/${number.toLowerCase()}.jpg`,
        variants: ["english"]
    });

    setsMap[setCode].cardCount++;
    setsMap[setCode].cardBreakdown[rarity] = (setsMap[setCode].cardBreakdown[rarity] || 0) + 1;
});

// Update Sets
for (const [code, setData] of Object.entries(setsMap)) {
    fs.writeFileSync(path.join('src/content/sets', `${code.toLowerCase()}.json`), JSON.stringify(setData, null, 2));
    fs.writeFileSync(path.join('src/content/cards', `${code.toLowerCase()}.json`), JSON.stringify(cardsMap[code], null, 4));
}

// Update Promos
const promoFilePath = 'src/content/cards/en-promo.json';
let existingPromos = [];
if (fs.existsSync(promoFilePath)) {
    existingPromos = JSON.parse(fs.readFileSync(promoFilePath, 'utf8'));
}

promoCards.forEach(p => {
    // Check if exists
    if (!existingPromos.find(ep => ep.cardCode === p.cardId)) {
        const number = p.cardId.replace('NRSA-', ''); // PR-001
        existingPromos.push({
            id: p.cardId.toLowerCase(),
            slug: p.cardId.toLowerCase(),
            setId: "en-promo",
            setSlug: "en-promo",
            officialCode: "NRSA-PR",
            cardCode: p.cardId,
            number: number,
            name: p.name,
            rarity: p.rarity,
            type: "card",
            character: p.name,
            characterSlug: generateSlug(p.name),
            image: `/images/cards/en-promo/${number.toLowerCase()}.jpg`,
            variants: ["english"],
            isPromo: true,
            notes: ""
        });
    }
});

fs.writeFileSync(promoFilePath, JSON.stringify(existingPromos, null, 4));

console.log('Cards processed successfully.');
