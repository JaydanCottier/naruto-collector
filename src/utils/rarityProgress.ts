import { RARITY_MAP } from './rarity.ts';

// Extract just the rank from RARITY_MAP for sorting
const RARITY_RANK = Object.fromEntries(
    Object.entries(RARITY_MAP).map(([key, val]) => [key, val.sortOrder])
);

// Extract color mapping
const RARITY_HEX = Object.fromEntries(
    Object.entries(RARITY_MAP).map(([key, val]) => [key, val.color])
);

// Simple labels
const RARITY_NAMES = Object.fromEntries(
    Object.entries(RARITY_MAP).map(([key, val]) => [key, val.label])
);

export interface RarityProgress {
    rarity: string;
    rarityName: string;
    rarityHex: string;
    total: number;
    owned: number;
    missing: number;
    percent: number;
    cards: any[];
    ownedCardIds: Set<string>;
    missingCards: any[];
}

export function getRarityProgress(
    collection: any,
    allCards: any[]
): RarityProgress[] {
    // Group cards by rarity
    const rarityMap = new Map<string, any[]>();
    for (const card of allCards) {
        if (!rarityMap.has(card.rarity)) rarityMap.set(card.rarity, []);
        rarityMap.get(card.rarity)!.push(card);
    }

    return [...rarityMap.entries()]
        .map(([rarity, cards]) => {
            const ownedIds = new Set(
                cards
                    .filter(c => collection?.owned?.[c.id]?.owned === true)
                    .map(c => c.id)
            );
            const missing = cards.filter(c => !ownedIds.has(c.id));
            return {
                rarity,
                rarityName: RARITY_NAMES[rarity] ?? rarity,
                rarityHex: RARITY_HEX[rarity] ?? '#6b7280',
                total: cards.length,
                owned: ownedIds.size,
                missing: missing.length,
                percent: Math.round((ownedIds.size / cards.length) * 100) || 0,
                cards,
                ownedCardIds: ownedIds,
                missingCards: missing,
            };
        })
        .sort((a, b) => (RARITY_RANK[b.rarity] ?? 999) - (RARITY_RANK[a.rarity] ?? 999));
}

export function getRarityProgressForSet(
    collection: any,
    setCards: any[]
): RarityProgress[] {
    return getRarityProgress(collection, setCards);
}
