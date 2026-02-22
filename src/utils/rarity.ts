// Rarity system — v6 spec (34 rarities)
// CRITICAL: Use SLR+ / SLR- (never SLR), SV-S / SV-G (never SV)

export interface RarityInfo {
    code: string;
    label: string;
    color: string;
    sortOrder: number;
    description: string;
}

export const RARITY_MAP: Record<string, RarityInfo> = {
    R: { code: 'R', label: 'Rare', color: '#6b7280', sortOrder: 1, exclusiveSource: null },
    SR: { code: 'SR', label: 'Super Rare', color: '#3b82f6', sortOrder: 2, exclusiveSource: null },
    SSR: { code: 'SSR', label: 'Super Super Rare', color: '#8b5cf6', sortOrder: 3, exclusiveSource: null },
    TR: { code: 'TR', label: 'Tier Rare', color: '#06b6d4', sortOrder: 4, exclusiveSource: 'T3 ONLY' },
    TGR: { code: 'TGR', label: 'Tier Gold Rare', color: '#14b8a6', sortOrder: 5, exclusiveSource: 'T3 ONLY' },
    HR: { code: 'HR', label: 'Hyper Rare', color: '#ec4899', sortOrder: 6, exclusiveSource: 'T4 W2+ (HR001-009 T4W1 ONLY). Replaced by PTR T4W6+.' },
    PTR: { code: 'PTR', label: 'Poster Rare', color: '#f97316', sortOrder: 7, description: 'Ninja Age+, T4W6+, NRSA01+02' },
    ZR: { code: 'ZR', label: 'Z Rare', color: '#f97316', sortOrder: 8, exclusiveSource: 'T2 ONLY: W4(001-012) W5(013-024) W6(025-036)' },
    PU: { code: 'PU', label: 'Puzzle Rare', color: '#e879f9', sortOrder: 9, description: 'T4W6+, NRSA01+02' },
    UR: { code: 'UR', label: 'Ultra Rare', color: '#f59e0b', sortOrder: 10, exclusiveSource: null },
    OR: { code: 'OR', label: 'Omega Rare', color: '#ea580c', sortOrder: 11, exclusiveSource: 'Multiple tiers. Removed in T4W6.' },
    AR: { code: 'AR', label: 'Alpha Rare', color: '#a855f7', sortOrder: 12, exclusiveSource: 'AR1-10 silver = T3W1 ONLY. Rarer than BP T4W7+.' },
    'SLR+': { code: 'SLR+', label: 'Secret Legend (Black)', color: '#f97316', sortOrder: 13, exclusiveSource: 'T4 + EX ONLY. BLACK variant.' },
    'SLR-': { code: 'SLR-', label: 'Secret Legend (White)', color: '#f97316', sortOrder: 14, exclusiveSource: 'T4 + EX ONLY. WHITE variant. #6 Itachi = T4W1 ONLY.' },
    SP: { code: 'SP', label: 'Special', color: '#ef4444', sortOrder: 15, exclusiveSource: 'SP005-008 T4W1 ONLY. SP009 EX ONLY.' },
    CP: { code: 'CP', label: 'Capital Promo', color: '#f59e0b', sortOrder: 16, exclusiveSource: 'T2.5 ONLY. Gold foil. Never reprinted.' },
    GP: { code: 'GP', label: 'Gold Promo', color: '#fbbf24', sortOrder: 17, exclusiveSource: 'T1 ONLY (W2+)' },
    MR: { code: 'MR', label: 'Master Rare', color: '#c084fc', sortOrder: 18, exclusiveSource: null },
    QR: { code: 'QR', label: 'Quest Rare', color: '#a78bfa', sortOrder: 19, description: 'Ninja Age ONLY. /720 (hidden /72). REDEMPTION CHINA ONLY.' },
    XR: { code: 'XR', label: 'Extreme Rare', color: '#3b82f6', sortOrder: 20, description: 'Ninja Age ONLY. /720 (hidden /72).' },
    CR: { code: 'CR', label: 'Collector Rare', color: '#f472b6', sortOrder: 21, exclusiveSource: 'T2 ONLY (W2+). Case hit.' },
    NR: { code: 'NR', label: 'Ninja Rare', color: '#34d399', sortOrder: 22, exclusiveSource: 'T3 ONLY (W2+). Case hit. Rainbow foil.' },
    BP: { code: 'BP', label: 'Battle Promo', color: '#64748b', sortOrder: 23, exclusiveSource: 'T4 ONLY (W2+). Case hit.' },
    SE: { code: 'SE', label: 'Serial Edition', color: '#f59e0b', sortOrder: 24, exclusiveSource: 'T4W4(/777) T4W5(serialized) EX4+5. $300+ range.' },
    '20TH': { code: '20TH', label: 'Anniversary Promo', color: '#f59e0b', sortOrder: 25, description: 'T4W4 2nd PRINT ONLY. 7th Hokage Naruto.' },
    LR: { code: 'LR', label: 'Legendary Rare', color: '#fcd34d', sortOrder: 26, description: 'BLISTER PACKS ONLY' },
    PR: { code: 'PR', label: 'Promo', color: '#94a3b8', sortOrder: 27, description: 'Events + display boxes.' },
    BR: { code: 'BR', label: 'Badge Rare (Pin)', color: '#94a3b8', sortOrder: 28, description: 'PIN BLIND BOX ONLY' },
    XP: { code: 'XP', label: 'Extra Pack', color: '#10b981', sortOrder: 29, description: 'FIGURE BLIND BOX ONLY' },
    PUR: { code: 'PUR', label: 'Purple Rare', color: '#7c3aed', sortOrder: 30, exclusiveSource: null },
    SCR: { code: 'SCR', label: 'Scroll Rare', color: '#f97316', sortOrder: 31, description: 'YOUTH SCROLL BOX ONLY. Naruto + Boruto pair.' },
    'SV-S': { code: 'SV-S', label: 'Scroll Variant Silver', color: '#94a3b8', sortOrder: 32, description: 'HEAVEN+EARTH SCROLL ONLY. Silver variant.' },
    'SV-G': { code: 'SV-G', label: 'Scroll Variant Gold', color: '#f59e0b', sortOrder: 33, description: 'HEAVEN+EARTH SCROLL ONLY. Gold variant. Minato+Kakashi rarest.' },
};

export const RAINBOW_GRADIENT = 'linear-gradient(135deg,#f97316,#ec4899,#8b5cf6,#3b82f6)';

export const TIER_COLORS: Record<string, string> = {
    T1: '#6b7280',
    T2: '#3b82f6',
    'T2.5': '#f59e0b',
    T3: '#8b5cf6',
    T4: '#dc2626',
    EX: '#f97316',
    BLISTER: '#fcd34d',
    PIN: '#94a3b8',
    FIGURE: '#10b981',
    SP: '#ec4899',
    PR: '#94a3b8',
};

export const VARIANT_OPTIONS = [
    { value: 'standard', label: 'Standard' },
    { value: 'holo', label: 'Holographic' },
    { value: 'gold', label: 'Gold Foil' },
    { value: 'silver', label: 'Silver Foil' },
    { value: 'black', label: 'Black (SLR+)' },
    { value: 'white', label: 'White (SLR-)' },
    { value: 'diamond', label: 'Diamond Parallel' },
    { value: 'english', label: 'English' },
    { value: 'SLR+', label: 'SLR+ (Black)' },
    { value: 'SLR-', label: 'SLR- (White)' },
    { value: 'SV-S', label: 'SV Silver' },
    { value: 'SV-G', label: 'SV Gold' },
];

// Filter panel rarity grid layout (6 rows as per v6 spec)
export const RARITY_GRID_ROWS = [
    ['R', 'SR', 'SSR', 'TR', 'HR', 'PTR'],
    ['ZR', 'TGR', 'PU', 'UR', 'OR', 'AR'],
    ['SLR+', 'SLR-', 'SP', 'CP', 'GP', 'MR'],
    ['QR', 'XR', 'CR', 'NR', 'BP', 'SE'],
    ['20TH', 'LR', 'PR', 'BR', 'XP', 'PUR'],
    ['SCR', 'SV-S', 'SV-G'],
];

export function getRarityInfo(rarity: string): RarityInfo {
    return RARITY_MAP[rarity] || { code: rarity, label: rarity, color: '#6b7280', sortOrder: 99, description: '' };
}

export function getRarityColor(rarity: string): string {
    return RARITY_MAP[rarity]?.color || '#6b7280';
}

export function getRarityLabel(rarity: string): string {
    return RARITY_MAP[rarity]?.label || rarity;
}

export function getRaritySortOrder(rarity: string): number {
    return RARITY_MAP[rarity]?.sortOrder || 99;
}

export function isRainbowRarity(rarity: string): boolean {
    return ['SCR', 'XR'].includes(rarity);
}

export function getTierColor(tier: string): string {
    return TIER_COLORS[tier] || '#6b7280';
}

export function getRarityDescription(rarity: string): string | null {
    return RARITY_MAP[rarity]?.description || '';
}

// Figure type display
export const FIGURE_TYPE_LABELS: Record<string, string> = {
    regular: 'Regular',
    eternal: 'Eternal',
    ultimate: 'Ultimate',
    big: 'Big',
    'chase-small': 'Chase',
};

export const FIGURE_TYPE_COLORS: Record<string, string> = {
    regular: '#6b7280',
    eternal: '#f59e0b',
    ultimate: '#ef4444',
    big: '#8b5cf6',
    'chase-small': '#f97316',
};
