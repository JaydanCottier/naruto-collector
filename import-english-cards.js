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
    const region = parts[parts.length - 1];
    const manufacturer = parts[parts.length - 2];
    const chineseWave = parts[parts.length - 3];
    const chineseTier = parts[parts.length - 4];
    const setNameRaw = parts[parts.length - 5];
    const baseSetCode = parts[parts.length - 6];
    const cardIdRaw = parts[parts.length - 7];
    const rarity = parts[parts.length - 8];
    const name = parts.slice(0, parts.length - 8).join(',');

    const isPromo = baseSetCode === 'Promo' || cardIdRaw.includes('-PR-');

    if (isPromo) {
        promoCards.push({ name, rarity, cardId: cardIdRaw, setCode: baseSetCode, setName: setNameRaw });
        return;
    }

    // Fix for SEA cards where baseSetCode is just 'NRSA'
    let actualBaseSetCode = baseSetCode;
    if (baseSetCode === 'NRSA' && region === 'SEA') {
        const waveNum = parseInt(chineseWave.replace('Wave ', '').trim());
        if (waveNum === 6) actualBaseSetCode = 'NRSA01';
        if (waveNum === 7) actualBaseSetCode = 'NRSA02';
    }

    const setCode = `${actualBaseSetCode}-${region}`;
    const setName = `${setNameRaw} (${region})`;

    if (!setsMap[setCode]) {
        setsMap[setCode] = {
            id: setCode.toLowerCase(),
            slug: setCode.toLowerCase(),
            officialCode: actualBaseSetCode,
            name: setName,
            displayName: setName,
            tier: "EN",
            wave: parseInt(actualBaseSetCode.replace('NRSA', '')),
            series: "English",
            type: "booster",
            language: "EN",
            region: region,
            isMaster: region === 'US',
            releaseDate: "2024-01-01", // Placeholder
            cardCount: 0,
            packCount: 36,
            packContents: "5 cards per pack",
            description: `KAYOU Naruto ${setName}`,
            logoImage: `/images/sets/${actualBaseSetCode.toLowerCase()}-logo.png`,
            bannerImage: `/images/sets/${actualBaseSetCode.toLowerCase()}-banner.jpg`,
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
    // Actually, SEA cards might use NRSA01-SE-001L5 as well in the cardIdRaw, which is from the CSV.
    // Except they don't, for SEA it's NRSA-SE-001L5. We need to handle that.
    const number = cardIdRaw.replace(`${baseSetCode}-`, '');
    const isScene = rarity === 'R';
    const character = isScene ? 'Various' : name;
    // uniqueCardId will be like NRSA-SE-001L5-SEA or NRSA01-SE-001L5-US
    const uniqueCardId = `${cardIdRaw}-${region}`;

    cardsMap[setCode].push({
        id: uniqueCardId.toLowerCase(),
        slug: uniqueCardId.toLowerCase(),
        setId: setCode.toLowerCase(),
        setSlug: setCode.toLowerCase(),
        officialCode: actualBaseSetCode,
        cardCode: `${cardIdRaw} (${region})`,
        number: number,
        name: name,
        rarity: rarity,
        type: "card",
        character: character,
        characterSlug: generateSlug(character),
        // Image path defaults to without region for now, since they use same artwork
        image: `/images/cards/${actualBaseSetCode.toLowerCase()}/${number.toLowerCase()}.jpg`,
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
