import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const cardsDir = path.join(__dirname, 'src', 'content', 'cards');

function generateSeedCards(setId, officialCode, count, baseName) {
    const cards = [];
    for (let i = 1; i <= count; i++) {
        const numStr = i.toString().padStart(3, '0');
        cards.push({
            id: `${setId}-${numStr}`,
            slug: `${setId}-${numStr}`,
            setId: setId,
            setSlug: setId,
            officialCode: officialCode,
            cardCode: `${officialCode}-${numStr}`,
            number: numStr,
            name: `${baseName} Character ${i}`,
            rarity: "R",
            type: "character",
            image: `/images/cards/${setId}/${numStr}.jpg`
        });
    }
    fs.writeFileSync(path.join(cardsDir, `${setId}.json`), JSON.stringify(cards, null, 2));
    console.log(`Generated ${count} cards for ${setId}`);
}

generateSeedCards('heaven-scroll-s1', 'NRSA01', 8, 'Heaven Scroll');
generateSeedCards('jin-s2', 'NRSA2', 8, 'Chunin');
generateSeedCards('nrv01', 'NRV01', 8, 'Chapter Jin');
generateSeedCards('nrea01', 'NREA01', 8, 'Earth Scroll-001');
generateSeedCards('nrea02', 'NREA02', 8, 'Earth Scroll-002');
