// Build-time search index generator
// Reads all card JSON files and writes public/search.json
import { readFileSync, writeFileSync, readdirSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cardsDir = join(__dirname, '..', 'src', 'content', 'cards');
const setsDir = join(__dirname, '..', 'src', 'content', 'sets');
const outputPath = join(__dirname, '..', 'public', 'search.json');

// Read all set names for lookup
const setNameMap = {};
const setFiles = readdirSync(setsDir).filter(f => f.endsWith('.json'));
for (const file of setFiles) {
    const set = JSON.parse(readFileSync(join(setsDir, file), 'utf-8'));
    setNameMap[set.id] = set.name;
}

// Read all card files and flatten
const searchIndex = [];
const cardFiles = readdirSync(cardsDir).filter(f => f.endsWith('.json'));

for (const file of cardFiles) {
    const cards = JSON.parse(readFileSync(join(cardsDir, file), 'utf-8'));
    for (const card of cards) {
        searchIndex.push({
            id: card.id,
            slug: card.slug,
            name: card.name,
            character: card.character || card.name,
            characterSlug: card.characterSlug || '',
            rarity: card.rarity,
            setId: card.setId,
            setName: setNameMap[card.setId] || card.setId,
            setSlug: card.setSlug || card.setId,
            image: card.image,
            cardSerial: card.cardSerial || `${card.setPrefix || card.setId}-${card.rarity}-${card.number}`,
            number: card.number || '',
            region: card.region || 'CN',
        });
    }
}

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, JSON.stringify(searchIndex));
console.log(`✅ Search index generated: ${searchIndex.length} cards → public/search.json`);
