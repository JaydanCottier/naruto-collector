import fs from 'node:fs';
import path from 'node:path';

const characters = ['Naruto Uzumaki', 'Sasuke Uchiha', 'Sakura Haruno', 'Kakashi Hatake', 'Itachi Uchiha', 'Hinata Hyuga', 'Minato Namikaze', 'Tsunade', 'Jiraiya', 'Orochimaru'];
const rarities = ['C', 'R', 'SR', 'UR', 'SEC'];
const types = ['Character', 'Jutsu', 'Weapon'];

function generateCards(setId, setSlug, series, startNumber) {
    const cards = [];
    for (let i = 1; i <= 15; i++) {
        const numStr = String(i).padStart(3, '0');
        const char = characters[Math.floor(Math.random() * characters.length)];
        const rarity = rarities[Math.floor(Math.random() * rarities.length)];
        const type = 'Character';

        cards.push({
            id: `${setId}-${numStr}`,
            slug: `${setId}-${numStr}-${char.toLowerCase().replace(/ /g, '-')}`,
            setId: setId,
            setSlug: setSlug,
            number: numStr,
            name: char,
            rarity: rarity,
            type: type,
            character: char,
            series: series,
            image: `/images/cards/placeholder.jpg`,
            description: `A card featuring ${char}.`,
            variant: rarity === 'SEC' ? 'Holo' : null
        });
    }
    return cards;
}

const sets = [
    { id: 'nt-01', slug: 'tin-box-series-1', series: 'Tin Box' },
    { id: 'nb-01', slug: 'booster-box-series-1', series: 'Booster Box' },
    { id: 'ns-01', slug: 'sp-box-series-1', series: 'SP Box' }
];

sets.forEach(set => {
    const cards = generateCards(set.id, set.slug, set.series, 1);
    fs.writeFileSync(
        path.join('src', 'content', 'cards', `${set.slug}.json`),
        JSON.stringify(cards, null, 2)
    );
});

console.log('Cards seeded successfully!');
