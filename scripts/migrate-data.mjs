/**
 * migrate-data.mjs
 * Adds affiliateLinks + pullRates to set JSONs, and characterSlug to card JSONs.
 * Run once: node scripts/migrate-data.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SETS_DIR = path.join(__dirname, '..', 'src', 'content', 'sets');
const CARDS_DIR = path.join(__dirname, '..', 'src', 'content', 'cards');

// Seed data from spec — keyed by set id
const SEED = {
    't1w1': { pullRates: { ur_per_packs: 12, hit_per_packs: 6, valueRating: 2 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 12, approxPriceCNY: 36 } },
    't2w1': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 140 } },
    't3w1': { pullRates: { ur_per_packs: 5, hit_per_packs: 2, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 28, approxPriceCNY: 100 } },
    't4w1': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 48, approxPriceCNY: 200 } },
    't2-5w1': { pullRates: { ur_per_packs: 6, hit_per_packs: 3, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 25, approxPriceCNY: 100 } },
    't2w2': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 140 } },
    't1w2': { pullRates: { ur_per_packs: 12, hit_per_packs: 6, valueRating: 2 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 12, approxPriceCNY: 36 } },
    't4w2': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 48, approxPriceCNY: 200 } },
    't3w2': { pullRates: { ur_per_packs: 5, hit_per_packs: 2, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 28, approxPriceCNY: 100 } },
    't2w3': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    't1w3': { pullRates: { ur_per_packs: 12, hit_per_packs: 6, valueRating: 2 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 12, approxPriceCNY: 36 } },
    't3w3': { pullRates: { ur_per_packs: 5, hit_per_packs: 2, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 28, approxPriceCNY: 100 } },
    't4w3': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 48, approxPriceCNY: 200 } },
    'youth-scroll': { pullRates: { ur_per_packs: 4, hit_per_packs: 2, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 35, approxPriceCNY: 200 } },
    'official-binder': { pullRates: { ur_per_packs: 0, hit_per_packs: 0, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 40, approxPriceCNY: 250 } },
    't2w4': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    't3w4': { pullRates: { ur_per_packs: 5, hit_per_packs: 2, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 28, approxPriceCNY: 100 } },
    't4w4': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 48, approxPriceCNY: 200 } },
    't1w4': { pullRates: { ur_per_packs: 12, hit_per_packs: 6, valueRating: 2 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 12, approxPriceCNY: 36 } },
    't2w5': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    't3w5': { pullRates: { ur_per_packs: 5, hit_per_packs: 2, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 28, approxPriceCNY: 100 } },
    'heaven-earth-scroll': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 65, approxPriceCNY: 400 } },
    't2w6': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    't4w5': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 55, approxPriceCNY: 200 } },
    '2023-new-year': { pullRates: { ur_per_packs: 0, hit_per_packs: 0, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 50, approxPriceCNY: 300 } },
    'age-of-ninjas': { pullRates: { ur_per_packs: 4, hit_per_packs: 2, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 45, approxPriceCNY: 280 } },
    'the-last-gift': { pullRates: { ur_per_packs: 0, hit_per_packs: 0, valueRating: 4 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 60, approxPriceCNY: 380 } },
    't4w6': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 55, approxPriceCNY: 200 } },
    't2w7': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    't2w8': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    't4w7': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 55, approxPriceCNY: 200 } },
    't2w9': { pullRates: { ur_per_packs: 8, hit_per_packs: 4, valueRating: 3 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 60 } },
    'heaven-scroll-s1': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: 'https://ebay.us/PLACEHOLDER', approxPriceUSD: 96, approxPriceCNY: 0 } },
    'jin-s2': { pullRates: { ur_per_packs: 3, hit_per_packs: 1, valueRating: 5 }, affiliateLinks: { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: 'https://ebay.us/PLACEHOLDER', approxPriceUSD: 48, approxPriceCNY: 0 } },
};

function toSlug(str) {
    return (str || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

// Migrate sets
console.log('=== Migrating Sets ===');
const setFiles = fs.readdirSync(SETS_DIR).filter(f => f.endsWith('.json'));
let setsUpdated = 0;
for (const file of setFiles) {
    const filePath = path.join(SETS_DIR, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const seed = SEED[data.id];

    let changed = false;
    if (!data.affiliateLinks && seed) {
        data.affiliateLinks = seed.affiliateLinks;
        changed = true;
    }
    if (!data.pullRates && seed) {
        data.pullRates = seed.pullRates;
        changed = true;
    }
    // Ensure defaults if no seed match
    if (!data.affiliateLinks) {
        data.affiliateLinks = { aliexpress: 'https://s.click.aliexpress.com/e/PLACEHOLDER', ebay: '', approxPriceUSD: 20, approxPriceCNY: 0 };
        changed = true;
    }
    if (!data.pullRates) {
        data.pullRates = { ur_per_packs: 0, hit_per_packs: 0, valueRating: 3 };
        changed = true;
    }

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n');
        setsUpdated++;
        console.log(`  ✓ ${file}`);
    }
}
console.log(`Updated ${setsUpdated} set files.\n`);

// Migrate cards — add characterSlug
console.log('=== Migrating Cards ===');
const cardFiles = fs.readdirSync(CARDS_DIR).filter(f => f.endsWith('.json'));
let cardsUpdated = 0;
for (const file of cardFiles) {
    const filePath = path.join(CARDS_DIR, file);
    const cards = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    let changed = false;

    for (const card of cards) {
        if (!card.characterSlug && card.character) {
            card.characterSlug = toSlug(card.character);
            changed = true;
        }
        if (!card.characterSlug) {
            card.characterSlug = null;
        }
    }

    if (changed) {
        fs.writeFileSync(filePath, JSON.stringify(cards, null, 2) + '\n');
        cardsUpdated++;
        console.log(`  ✓ ${file} (${cards.length} cards)`);
    }
}
console.log(`Updated ${cardsUpdated} card files.\n`);
console.log('Migration complete!');
