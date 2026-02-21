// Generate all set and card seed data
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const setsDir = join(__dirname, '..', 'src', 'content', 'sets');
const cardsDir = join(__dirname, '..', 'src', 'content', 'cards');

mkdirSync(setsDir, { recursive: true });
mkdirSync(cardsDir, { recursive: true });

// ========== SET DATA ==========
const sets = [
    { id: "t1w1", name: "T1W1", displayName: "Tier 1 Wave 1", tier: "T1", wave: 1, type: "booster", language: "CN", releaseDate: "2021-01-01", packCount: 36, description: "Chapter of Soldiers — Tier 1 Wave 1. The first T1 booster release." },
    { id: "t2w1", name: "T2W1", displayName: "Tier 2 Wave 1", tier: "T2", wave: 1, type: "booster", language: "CN", releaseDate: "2021-02-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 1. Introduces the T2 booster line." },
    { id: "t3w1", name: "T3W1", displayName: "Tier 3 Wave 1", tier: "T3", wave: 1, type: "booster", language: "CN", releaseDate: "2021-03-01", packCount: 20, description: "Chapter of Soldiers — Tier 3 Wave 1.", notes: "SP001/004 included" },
    { id: "t4w1", name: "T4W1", displayName: "Tier 4 Wave 1", tier: "T4", wave: 1, type: "booster", language: "CN", releaseDate: "2021-04-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 1. Premium T4 booster line." },
    { id: "t2-5w1", name: "T2.5W1", displayName: "Tier 2.5 Wave 1", tier: "T2.5", wave: 1, type: "special", language: "CN", releaseDate: "2021-06-01", packCount: 50, description: "Itachi Cloud Box — only one wave ever released. A unique special release featuring Itachi Uchiha.", notes: "Itachi Cloud Box — only one wave ever released" },
    { id: "t2w2", name: "T2W2", displayName: "Tier 2 Wave 2", tier: "T2", wave: 2, type: "booster", language: "CN", releaseDate: "2021-07-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 2. Introduces CR rarity." },
    { id: "t1w2", name: "T1W2", displayName: "Tier 1 Wave 2", tier: "T1", wave: 2, type: "booster", language: "CN", releaseDate: "2021-08-01", packCount: 36, description: "Chapter of Soldiers — Tier 1 Wave 2. Introduces GP rarity." },
    { id: "t4w2", name: "T4W2", displayName: "Tier 4 Wave 2", tier: "T4", wave: 2, type: "booster", language: "CN", releaseDate: "2021-09-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 2." },
    { id: "t3w2", name: "T3W2", displayName: "Tier 3 Wave 2", tier: "T3", wave: 2, type: "booster", language: "CN", releaseDate: "2021-10-01", packCount: 20, description: "Chapter of Soldiers — Tier 3 Wave 2." },
    { id: "t2w3", name: "T2W3", displayName: "Tier 2 Wave 3", tier: "T2", wave: 3, type: "booster", language: "CN", releaseDate: "2021-11-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 3." },
    { id: "t1w3", name: "T1W3", displayName: "Tier 1 Wave 3", tier: "T1", wave: 3, type: "booster", language: "CN", releaseDate: "2021-12-01", packCount: 36, description: "Chapter of Soldiers — Tier 1 Wave 3." },
    { id: "t3w3", name: "T3W3", displayName: "Tier 3 Wave 3", tier: "T3", wave: 3, type: "booster", language: "CN", releaseDate: "2022-01-01", packCount: 20, description: "Chapter of Soldiers — Tier 3 Wave 3." },
    { id: "t4w3", name: "T4W3", displayName: "Tier 4 Wave 3", tier: "T4", wave: 3, type: "booster", language: "CN", releaseDate: "2022-02-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 3." },
    { id: "youth-scroll", name: "Youth Scroll Box", displayName: "Youth Scroll Box", tier: "SP", wave: null, type: "gift", language: "CN", releaseDate: "2022-03-01", description: "Gift box featuring exclusive SCR Naruto and Boruto promo cards.", notes: "SCR Naruto & Boruto promos" },
    { id: "official-binder", name: "Official Binder Box", displayName: "Official Binder Box", tier: "SP", wave: null, type: "gift", language: "CN", releaseDate: "2022-04-01", description: "Official collector binder with exclusive promo cards." },
    { id: "t2w4", name: "T2W4", displayName: "Tier 2 Wave 4", tier: "T2", wave: 4, type: "booster", language: "CN", releaseDate: "2022-05-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 4. Introduces ZR rarity." },
    { id: "t3w4", name: "T3W4", displayName: "Tier 3 Wave 4", tier: "T3", wave: 4, type: "booster", language: "CN", releaseDate: "2022-06-01", packCount: 20, description: "Chapter of Soldiers — Tier 3 Wave 4." },
    { id: "t4w4", name: "T4W4", displayName: "Tier 4 Wave 4", tier: "T4", wave: 4, type: "booster", language: "CN", releaseDate: "2022-07-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 4.", notes: "2nd print includes 20th Anniversary promo" },
    { id: "t1w4", name: "T1W4", displayName: "Tier 1 Wave 4", tier: "T1", wave: 4, type: "booster", language: "CN", releaseDate: "2022-08-01", packCount: 36, description: "Chapter of Soldiers — Tier 1 Wave 4. Final Tier 1 wave.", notes: "Final Tier 1 wave" },
    { id: "t2w5", name: "T2W5", displayName: "Tier 2 Wave 5", tier: "T2", wave: 5, type: "booster", language: "CN", releaseDate: "2022-09-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 5." },
    { id: "t3w5", name: "T3W5", displayName: "Tier 3 Wave 5", tier: "T3", wave: 5, type: "booster", language: "CN", releaseDate: "2022-10-01", packCount: 20, description: "Chapter of Soldiers — Tier 3 Wave 5. Final Tier 3 wave.", notes: "Final Tier 3 wave" },
    { id: "heaven-earth-scroll", name: "Heaven and Earth Scroll Box", displayName: "Heaven and Earth Scroll Box", tier: "SP", wave: null, type: "gift", language: "CN", releaseDate: "2022-11-11", description: "11.11 gift set with exclusive SV (Scroll Variant) cards.", notes: "11.11 gift set with exclusive SV cards" },
    { id: "t2w6", name: "T2W6", displayName: "Tier 2 Wave 6", tier: "T2", wave: 6, type: "booster", language: "CN", releaseDate: "2022-12-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 6." },
    { id: "t4w5", name: "T4W5", displayName: "Tier 4 Wave 5", tier: "T4", wave: 5, type: "booster", language: "CN", releaseDate: "2023-01-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 5. Features serialized SE cards.", notes: "Serialized SE cards: Jiraiya /199, Sasuke-Itachi /699, Tsunade /999" },
    { id: "2023-new-year", name: "2023 New Year Legendary Scroll Box", displayName: "2023 New Year Legendary Scroll Box", tier: "SP", wave: null, type: "gift", language: "CN", releaseDate: "2023-01-15", description: "Limited New Year gift box with exclusive legendary scroll cards." },
    { id: "age-of-ninjas", name: "The Age of Ninjas", displayName: "The Age of Ninjas", tier: "SP", wave: null, type: "special", language: "CN", releaseDate: "2023-03-01", description: "Noble Edition introducing PTR, QR, and XR rarities.", notes: "Introduces PTR/QR/XR rarities. Noble Edition." },
    { id: "the-last-gift", name: "The Last: Naruto the Movie Gift Box", displayName: "The Last: Naruto the Movie Gift Box", tier: "SP", wave: null, type: "gift", language: "CN", releaseDate: "2023-06-01", description: "Movie commemoration gift set for The Last: Naruto the Movie.", notes: "Movie commemoration gift set" },
    { id: "t4w6", name: "T4W6", displayName: "Tier 4 Wave 6", tier: "T4", wave: 6, type: "booster", language: "CN", releaseDate: "2023-09-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 6. New simplified rarity system.", englishEquivalent: "heaven-scroll-s1" },
    { id: "t2w7", name: "T2W7", displayName: "Tier 2 Wave 7", tier: "T2", wave: 7, type: "booster", language: "CN", releaseDate: "2023-11-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 7." },
    { id: "t2w8", name: "T2W8", displayName: "Tier 2 Wave 8", tier: "T2", wave: 8, type: "booster", language: "CN", releaseDate: "2024-03-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 8.", englishEquivalent: "heaven-scroll-earth" },
    { id: "t4w7", name: "T4W7", displayName: "Tier 4 Wave 7", tier: "T4", wave: 7, type: "booster", language: "CN", releaseDate: "2024-06-01", packCount: 20, description: "Chapter of Soldiers — Tier 4 Wave 7.", englishEquivalent: "jin-s2" },
    { id: "t2w9", name: "T2W9", displayName: "Tier 2 Wave 9", tier: "T2", wave: 9, type: "booster", language: "CN", releaseDate: "2024-09-01", packCount: 30, description: "Chapter of Soldiers — Tier 2 Wave 9." },
    // English releases
    { id: "heaven-scroll-s1", name: "Heaven Scroll Series 1", displayName: "Heaven Scroll Series 1", tier: "T4", wave: null, type: "booster", language: "EN", releaseDate: "2025-01-01", packCount: 24, description: "First English language KAYOU Naruto release. 8 cards per pack.", cnEquivalent: "t4w6", notes: "8 cards/pack. Exclusive PR Konan card in 24-pack display box." },
    { id: "jin-s2", name: "Jin Series 2", displayName: "Jin Series 2", tier: "T4", wave: null, type: "booster", language: "EN", releaseDate: "2025-06-01", packCount: 12, description: "Second English release. 12 blister packs per display.", cnEquivalent: "t4w7", notes: "12 blister packs per display." },
];

// ========== CHARACTER & RARITY POOLS ==========
const characters = [
    "Naruto Uzumaki", "Sasuke Uchiha", "Sakura Haruno", "Kakashi Hatake",
    "Itachi Uchiha", "Gaara", "Rock Lee", "Neji Hyuga",
    "Hinata Hyuga", "Jiraiya", "Tsunade", "Orochimaru",
    "Minato Namikaze", "Obito Uchiha", "Pain", "Konan",
    "Shikamaru Nara", "Might Guy", "Killer Bee", "Madara Uchiha"
];

const arcs = [
    "Land of Waves", "Chunin Exams", "Search for Tsunade", "Sasuke Recovery",
    "Kazekage Rescue", "Akatsuki Suppression", "Pain's Assault", "Five Kage Summit",
    "Fourth Shinobi War", "The Last"
];

const cardTypes = ["Character", "Character", "Character", "Character", "Jutsu", "Jutsu", "Weapon", "Scene"];

// Rarity pools per tier
const rarityPools = {
    T1: ['R', 'SR', 'SSR', 'UR', 'GP', 'SP'],
    T2: ['R', 'SR', 'SSR', 'UR', 'CR', 'ZR', 'SP'],
    'T2.5': ['R', 'SR', 'SSR', 'UR', 'CP'],
    T3: ['R', 'SR', 'SSR', 'TR', 'TGR', 'NR', 'UR', 'SP'],
    T4: ['R', 'SR', 'SSR', 'HR', 'UR', 'BP', 'SP', 'SE'],
    SP: ['R', 'SR', 'SSR', 'UR', 'SP', 'PR', 'SCR', 'SV'],
    'T4-new': ['R', 'SR', 'SSR', 'PTR', 'UR', 'PU', 'MR', 'BP', 'SP', 'SE'],
};

function slugify(str) {
    return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generateCards(set) {
    const cards = [];
    const numCards = 8;
    // Pick a rarity pool
    let pool;
    if (['t4w6', 't4w7', 'heaven-scroll-s1', 'jin-s2'].includes(set.id)) {
        pool = rarityPools['T4-new'];
    } else if (set.tier === 'SP') {
        pool = rarityPools.SP;
    } else {
        pool = rarityPools[set.tier] || rarityPools.T2;
    }

    // Special set rarities
    if (set.id === 'age-of-ninjas') pool = ['R', 'SR', 'SSR', 'PTR', 'QR', 'XR', 'UR', 'SP'];
    if (set.id === 'heaven-earth-scroll') pool = ['R', 'SR', 'SSR', 'UR', 'SV', 'SP'];
    if (set.id === 'youth-scroll') pool = ['R', 'SR', 'SSR', 'UR', 'SCR', 'SP'];

    // Assign each card a rarity from the pool, ensuring spread
    for (let i = 0; i < numCards; i++) {
        const charIndex = (sets.indexOf(set) * 3 + i) % characters.length;
        const character = characters[charIndex];
        const rarity = pool[i % pool.length];
        const arcIndex = (sets.indexOf(set) + i) % arcs.length;
        const typeIndex = i % cardTypes.length;
        const num = String(i + 1).padStart(3, '0');
        const cardId = `${set.id}-${num}`;
        const charSlug = slugify(character);

        const card = {
            id: cardId,
            slug: `${set.id}-${num}-${charSlug}`,
            setId: set.id,
            setSlug: set.id,
            number: num,
            name: character,
            rarity: rarity,
            type: cardTypes[typeIndex],
            character: character,
            arc: arcs[arcIndex],
            image: `/images/cards/${cardId}.jpg`,
            description: "",
            variant: null,
            serialLimit: rarity === 'SE' ? [199, 699, 999][i % 3] : null,
            isPromo: rarity === 'PR',
        };
        cards.push(card);
    }
    return cards;
}

// ========== WRITE FILES ==========
let totalCards = 0;

for (const set of sets) {
    // Write set JSON
    const setData = {
        id: set.id,
        slug: set.id,
        name: set.name,
        displayName: set.displayName || set.name,
        tier: set.tier,
        wave: set.wave ?? null,
        series: set.tier.startsWith('T') ? `Tier ${set.tier.replace('T', '')}` : 'Special',
        type: set.type,
        language: set.language,
        releaseDate: set.releaseDate,
        cardCount: 8,
        packCount: set.packCount || null,
        packPrice: set.type === 'booster' ? (set.language === 'CN' ? '2¥' : '$4.99') : null,
        description: set.description || '',
        logoImage: `/images/sets/${set.id}-logo.png`,
        bannerImage: `/images/sets/${set.id}-banner.jpg`,
        notes: set.notes || '',
        englishEquivalent: set.englishEquivalent || null,
        cnEquivalent: set.cnEquivalent || null,
    };

    writeFileSync(join(setsDir, `${set.id}.json`), JSON.stringify(setData, null, 2));

    // Write cards JSON
    const cards = generateCards(set);
    totalCards += cards.length;
    writeFileSync(join(cardsDir, `${set.id}.json`), JSON.stringify(cards, null, 2));
}

console.log(`✅ Generated ${sets.length} sets and ${totalCards} cards`);
