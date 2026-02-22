const fs = require('fs');
const path = require('path');

const setsDir = path.join(__dirname, 'src', 'content', 'sets');
const cardsDir = path.join(__dirname, 'src', 'content', 'cards');

const setMap = new Map();

// 1. Process Sets
function processSets() {
    console.log('Processing sets...');
    const files = fs.readdirSync(setsDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(setsDir, file);
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        let modified = false;

        // Fix region
        if (data.region === 'US') {
            data.region = 'NA';
            modified = true;
        } else if (!data.region) {
            data.region = 'CN';
            modified = true;
        }

        // Fix regions
        if (data.regions && data.regions.includes('US')) {
            data.regions = data.regions.map(r => r === 'US' ? 'NA' : r);
            modified = true;
        }

        // Fix usEquivalent -> naEquivalent
        if ('usEquivalent' in data) {
            data.naEquivalent = data.usEquivalent;
            delete data.usEquivalent;
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
        }

        // Add to map for card processing
        setMap.set(data.id, data);
    }
}

// 2. Process Cards
function processCards() {
    console.log('Processing cards...');
    const files = fs.readdirSync(cardsDir).filter(f => f.endsWith('.json'));

    for (const file of files) {
        const filePath = path.join(cardsDir, file);
        let cards = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        let modified = false;

        for (const card of cards) {
            const set = setMap.get(card.setId) || {};

            // Determine region
            if (!card.region || card.region === 'US' || card.region !== set.region) {
                card.region = set.region || 'CN';
                modified = true;
            }

            // Determine setPrefix
            if (!card.setPrefix) {
                // If the set has an officialCode, use that. Or default to upper case set id.
                card.setPrefix = set.officialCode || card.setId.toUpperCase();
                modified = true;
            }

            // Ensure cardNumber
            if (!card.cardNumber) {
                card.cardNumber = card.number;
                modified = true;
            }

            // Promote variants properties, establish defaults
            // Variant logic: "L1" for standard, "L2" for holo, etc.
            // If it's not set, we'll try to guess based on existing variant string, or default.
            if (!card.isPromo) {
                if (!card.variantLevel) {
                    card.variantLevel = 'L1';
                    modified = true;
                }
                if (!card.variantLevelDesc) {
                    card.variantLevelDesc = 'Standard';
                    modified = true;
                }
            }

            // Build cardSerial: [PREFIX]-[RARITY]-[NUMBER][LEVEL]
            if (!card.cardSerial) {
                if (card.isPromo) {
                    // Promo usually looks like NRSA-PR-001 (prefix = NRSA-PR)
                    card.cardSerial = `${card.setPrefix}-${card.cardNumber}`;
                } else {
                    card.cardSerial = `${card.setPrefix}-${card.rarity}-${card.cardNumber}${card.variantLevel || ''}`;
                }
                modified = true;
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, JSON.stringify(cards, null, 4));
        }
    }
}

processSets();
processCards();
console.log('Update complete.');
