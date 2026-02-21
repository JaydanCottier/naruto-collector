// Rarity colour map, labels, and sort ordering
// Sort order: lower = more common, higher = rarer

export interface RarityInfo {
    code: string;
    label: string;
    color: string;
    sortOrder: number;
    isGradient: boolean;
}

export const RARITY_MAP: Record<string, RarityInfo> = {
    R: { code: 'R', label: 'Rare', color: '#6b7280', sortOrder: 1, isGradient: false },
    SR: { code: 'SR', label: 'Super Rare', color: '#3b82f6', sortOrder: 2, isGradient: false },
    SSR: { code: 'SSR', label: 'SSR', color: '#8b5cf6', sortOrder: 3, isGradient: false },
    TR: { code: 'TR', label: 'Tier Rare', color: '#06b6d4', sortOrder: 4, isGradient: false },
    HR: { code: 'HR', label: 'Hyper Rare', color: '#ec4899', sortOrder: 5, isGradient: false },
    TGR: { code: 'TGR', label: 'TGR', color: '#14b8a6', sortOrder: 6, isGradient: false },
    NR: { code: 'NR', label: 'NR', color: '#34d399', sortOrder: 7, isGradient: false },
    ZR: { code: 'ZR', label: 'ZR', color: '#f97316', sortOrder: 8, isGradient: false },
    GP: { code: 'GP', label: 'GP', color: '#fbbf24', sortOrder: 9, isGradient: false },
    BP: { code: 'BP', label: 'Battle Promo', color: '#64748b', sortOrder: 10, isGradient: false },
    CP: { code: 'CP', label: 'Capital Promo', color: '#f59e0b', sortOrder: 11, isGradient: false },
    CR: { code: 'CR', label: 'CR', color: '#f472b6', sortOrder: 12, isGradient: false },
    OR: { code: 'OR', label: 'OR', color: '#f97316', sortOrder: 13, isGradient: false },
    AR: { code: 'AR', label: 'AR', color: '#a855f7', sortOrder: 14, isGradient: false },
    PTR: { code: 'PTR', label: 'PTR', color: '#f97316', sortOrder: 15, isGradient: false },
    QR: { code: 'QR', label: 'QR', color: '#a78bfa', sortOrder: 16, isGradient: false },
    UR: { code: 'UR', label: 'Ultra Rare', color: '#f59e0b', sortOrder: 17, isGradient: false },
    MR: { code: 'MR', label: 'MR', color: '#c084fc', sortOrder: 18, isGradient: false },
    PU: { code: 'PU', label: 'PU', color: '#e879f9', sortOrder: 19, isGradient: false },
    LR: { code: 'LR', label: 'Legendary Rare', color: '#fcd34d', sortOrder: 20, isGradient: false },
    SP: { code: 'SP', label: 'Special', color: '#ef4444', sortOrder: 21, isGradient: false },
    SE: { code: 'SE', label: 'Serialized', color: '#f59e0b', sortOrder: 22, isGradient: false },
    PR: { code: 'PR', label: 'Promo', color: '#94a3b8', sortOrder: 23, isGradient: false },
    SLR: { code: 'SLR', label: 'SLR', color: '#f97316', sortOrder: 24, isGradient: true },
    SCR: { code: 'SCR', label: 'Scroll Rare', color: '#f59e0b', sortOrder: 25, isGradient: true },
    SV: { code: 'SV', label: 'Scroll Variant', color: '#a855f7', sortOrder: 26, isGradient: true },
    XR: { code: 'XR', label: 'XR', color: '#3b82f6', sortOrder: 27, isGradient: true },
};

export function getRarityInfo(rarity: string): RarityInfo {
    return RARITY_MAP[rarity] || { code: rarity, label: rarity, color: '#6b7280', sortOrder: 0, isGradient: false };
}

export function getRarityColor(rarity: string): string {
    return getRarityInfo(rarity).color;
}

export function getRarityLabel(rarity: string): string {
    return getRarityInfo(rarity).label;
}

export function sortByRarity(a: string, b: string): number {
    return (RARITY_MAP[b]?.sortOrder || 0) - (RARITY_MAP[a]?.sortOrder || 0);
}

// Tier colours for set browse grouping
export const TIER_COLORS: Record<string, string> = {
    'T1': '#6b7280',
    'T2': '#3b82f6',
    'T2.5': '#f59e0b',
    'T3': '#8b5cf6',
    'T4': '#f97316',
    'SP': '#ef4444',
};

export function getTierColor(tier: string): string {
    return TIER_COLORS[tier] || '#6b7280';
}
