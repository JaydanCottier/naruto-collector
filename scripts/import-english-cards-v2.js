import fs from 'fs';
import path from 'path';

const basePath = 'Information';
const usCsvPath = path.join(basePath, 'English_Naruto_KAYOU_Cardlist - US Prints.csv');
const seaCsvPath = path.join(basePath, 'English_Naruto_KAYOU_Cardlist - SEA Prints.csv');
const refCsvPath = path.join(basePath, 'English_Naruto_KAYOU_Cardlist - KAYOU Naruto English Set Reference Table (Updated).csv');

// 1. Parse Reference Table
const refData = fs.readFileSync(refCsvPath, 'utf8');
const refRows = refData.trim().split('\n').map(row => row.trim());
refRows.shift(); // Remove header

const refMap = {}; // Set_ID -> US_Equivalent
const refNameMap = {}; // Set_ID + Region -> Set Name
refRows.forEach(row => {
    if (!row) return;
    const parts = row.split(','); // Set ID,Set Name,Region,Release Date,Chinese Equivalent,SEA Equivalent,US Equivalent
    const setId = parts[0];
    const setName = parts[1];
    const region = parts[2];
    const usEq = parts[6];
    refMap[setId] = usEq !== 'N/A' ? usEq : setId;
    refNameMap[`${setId}-${region}`] = setName;
});

// 2. Parse Cards
const setsMap = {};
const cardsMap = {};
const promoCards = [];

function generateSlug(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function processCsv(csvPath) {
    if (!fs.existsSync(csvPath)) return;
    const csvData = fs.readFileSync(csvPath, 'utf8');
    const rows = csvData.trim().split('\n').map(row => row.trim());

    // Name,Rarity,Card_ID,Set_ID,Set_Name,Chinese_Tier,Chinese_Wave,Licensed_Manufacturer,Region,Release_Date
    rows.shift();

    rows.forEach(row => {
        if (!row) return;
        // Handle commas in names
        let parts = [];
        let inQuotes = false;
        let currentPart = '';
        for (let i = 0; i < row.length; i++) {
            if (row[i] === '"') {
                inQuotes = !inQuotes;
            } else if (row[i] === ',' && !inQuotes) {
                parts.push(currentPart);
                currentPart = '';
            } else {
                currentPart += row[i];
            }
        }
        parts.push(currentPart);

        const releaseDate = parts[parts.length - 1];
        const region = parts[parts.length - 2];
        const manufacturer = parts[parts.length - 3];
        const chineseWave = parts[parts.length - 4];
        const chineseTier = parts[parts.length - 5];
        const setName = parts[parts.length - 6];
        const setIdRaw = parts[parts.length - 7];
        const cardIdRaw = parts[parts.length - 8];
        const rarity = parts[parts.length - 9];
        const name = parts.slice(0, parts.length - 9).join(',');

        const isPromo = setIdRaw === 'NRSA-PR' || cardIdRaw.includes('-PR-');

        if (isPromo) {
            promoCards.push({ name, rarity, cardId: cardIdRaw, setCode: setIdRaw, setName: setName, region });
            return;
        }

        const setCode = `${setIdRaw}-${region}`;
        const actualBaseSetCode = refMap[setIdRaw] || setIdRaw;
        const finalSetName = refNameMap[setCode] || setName;

        if (!setsMap[setCode]) {
            setsMap[setCode] = {
                id: setCode.toLowerCase(),
                slug: setCode.toLowerCase(),
                officialCode: actualBaseSetCode,
                name: finalSetName,
                displayName: finalSetName,
                tier: "EN",
                wave: parseInt(actualBaseSetCode.replace(/[^0-9]/g, '')) || 1,
                series: "English",
                type: "booster",
                language: "EN",
                region: region,
                isMaster: region === 'US',
                releaseDate: releaseDate,
                cardCount: 0,
                packCount: 36,
                packContents: "5 cards per pack",
                description: `KAYOU Naruto ${finalSetName}`,
                logoImage: `/images/sets/${actualBaseSetCode.toLowerCase()}-logo.png`,
                bannerImage: `/images/sets/${actualBaseSetCode.toLowerCase()}-banner.jpg`,
                caseSize: { regular: 36, master: null },
                boxVariants: null,
                cardBreakdown: {},
                retailAvailability: ["hobby"],
                boxesPerCarton: null,
                unsealed: false,
                notes: "",
                affiliateLinks: { ebay: "PLACEHOLDER", approxPriceUSD: 30, approxPriceCNY: 0 }
            };
            cardsMap[setCode] = [];
        }

        // Example: Card_ID = NRSA01-SE-001L5
        const numberMatch = cardIdRaw.match(/-([A-Z0-9]+)$/);
        const number = numberMatch ? numberMatch[1] : cardIdRaw.split('-').pop();

        const isScene = rarity === 'R';
        const character = isScene ? 'Various' : name;
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
            // Image path mapped to US equivalent base set code
            image: `/images/cards/${actualBaseSetCode.toLowerCase()}/${number.toLowerCase()}.jpg`,
            variants: ["english"]
        });

        setsMap[setCode].cardCount++;
        setsMap[setCode].cardBreakdown[rarity] = (setsMap[setCode].cardBreakdown[rarity] || 0) + 1;
    });
}

processCsv(usCsvPath);
processCsv(seaCsvPath);

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
        const numberMatch = p.cardId.match(/-([A-Z0-9]+)$/);
        const number = numberMatch ? numberMatch[1] : p.cardId.split('-').pop();

        let character = p.name;
        if (p.rarity === 'R') character = 'Various';

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
            character: character,
            characterSlug: generateSlug(character),
            image: `/images/cards/en-promo/${number.toLowerCase()}.jpg`,
            variants: ["english"],
            isPromo: true,
            exclusiveTo: ["nrsa01-us", "nrsa02-us"],
            notes: ""
        });
    }
});

fs.writeFileSync(promoFilePath, JSON.stringify(existingPromos, null, 4));

console.log('Processed v2 CSVs successfully.');
