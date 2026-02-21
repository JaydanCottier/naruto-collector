// Rarity colour map, labels, and sort ordering
// Sort order: lower = more common, higher = rarer

export interface RarityInfo {
    code: string;
    label: string;
    color: string;
    sortOrder: number;
    isGradient: boolean;
    exclusiveSource: string;
}

export const RARITY_MAP: Record<string, RarityInfo> = {
    R: { code: 'R', label: 'Rare', color: '#6b7280', sortOrder: 1, isGradient: false, exclusiveSource: 'All tiers (NOT holo in T1)' },
    SR: { code: 'SR', label: 'Super Rare', color: '#3b82f6', sortOrder: 2, isGradient: false, exclusiveSource: 'All tiers' },
    SSR: { code: 'SSR', label: 'SSR', color: '#8b5cf6', sortOrder: 3, isGradient: false, exclusiveSource: 'All tiers. VS pairs in Ninja Age.' },
    TR: { code: 'TR', label: 'Tier Rare', color: '#06b6d4', sortOrder: 4, isGradient: false, exclusiveSource: 'T3 ONLY. See-through chibi hologram.' },
    TGR: { code: 'TGR', label: 'Tier Gold Rare', color: '#14b8a6', sortOrder: 5, isGradient: false, exclusiveSource: 'T3 ONLY. TR with gold foil.' },
    HR: { code: 'HR', label: 'Hyper Rare', color: '#ec4899', sortOrder: 6, isGradient: false, exclusiveSource: 'T4 ONLY (W2+). HR 001-009 T4W1 ONLY. Replaced by PTR in T4W6.' },
    ZR: { code: 'ZR', label: 'Z Rare', color: '#f97316', sortOrder: 7, isGradient: false, exclusiveSource: 'T2 ONLY: W4(001-012) W5(013-024) W6(025-036). ZR33+36 hardest.' },
    UR: { code: 'UR', label: 'Ultra Rare', color: '#f59e0b', sortOrder: 8, isGradient: false, exclusiveSource: 'All tiers. Hit benchmark.' },
    OR: { code: 'OR', label: 'Omega Rare', color: '#ea580c', sortOrder: 9, isGradient: false, exclusiveSource: 'Multiple tiers. Removed T4W6.' },
    AR: { code: 'AR', label: 'Alpha Rare', color: '#a855f7', sortOrder: 10, isGradient: false, exclusiveSource: 'Multiple. AR1-10 silver = T3W1 ONLY. Higher than BP in T4W7+.' },
    PTR: { code: 'PTR', label: 'Poster Rare', color: '#f97316', sortOrder: 11, isGradient: false, exclusiveSource: 'Ninja Age+, T4W6+. 1 per pack.' },
    QR: { code: 'QR', label: 'Quest Rare', color: '#a78bfa', sortOrder: 12, isGradient: false, exclusiveSource: 'Ninja Age ONLY. /720 (hidden /72). REDEMPTION CHINA ONLY.' },
    GP: { code: 'GP', label: 'Gold Promo', color: '#fbbf24', sortOrder: 13, isGradient: false, exclusiveSource: 'T1 ONLY (W2+).' },
    CP: { code: 'CP', label: 'Capital Promo', color: '#f59e0b', sortOrder: 14, isGradient: false, exclusiveSource: 'T2.5 ONLY. Gold foil. Never reprinted.' },
    CR: { code: 'CR', label: 'Collector Rare', color: '#f472b6', sortOrder: 15, isGradient: false, exclusiveSource: 'T2 ONLY (W2+). Case hit.' },
    NR: { code: 'NR', label: 'Ninja Rare', color: '#34d399', sortOrder: 16, isGradient: true, exclusiveSource: 'T3 ONLY (W2+). Case hit. Rainbow foil.' },
    BP: { code: 'BP', label: 'Battle Promo', color: '#64748b', sortOrder: 17, isGradient: false, exclusiveSource: 'T4 ONLY (W2+). Case hit.' },
    MR: { code: 'MR', label: 'Master Rare', color: '#c084fc', sortOrder: 18, isGradient: false, exclusiveSource: 'All tiers. MR001+002 hardest. Zodiac/puzzle T4W6+.' },
    PU: { code: 'PU', label: 'Puzzle Rare', color: '#e879f9', sortOrder: 19, isGradient: false, exclusiveSource: 'T4W6+. Multi-card puzzle sets.' },
    LR: { code: 'LR', label: 'Legendary Rare', color: '#fcd34d', sortOrder: 20, isGradient: false, exclusiveSource: 'BLISTER PACKS ONLY.' },
    SP: { code: 'SP', label: 'Special', color: '#ef4444', sortOrder: 21, isGradient: false, exclusiveSource: 'Many sources. SP005-008 T4W1 ONLY. SP009 EX ONLY.' },
    SE: { code: 'SE', label: 'Serial Edition', color: '#f59e0b', sortOrder: 22, isGradient: false, exclusiveSource: 'T4W4(/777) T4W5(serialized) EX4+5. Panoramic pairs. $300+.' },
    PR: { code: 'PR', label: 'Promo', color: '#94a3b8', sortOrder: 23, isGradient: false, exclusiveSource: 'Events only. Cannot be pulled from any box.' },
    BR: { code: 'BR', label: 'Badge Rare', color: '#94a3b8', sortOrder: 24, isGradient: false, exclusiveSource: 'PIN BLIND BOX ONLY. 12 pins, 4 chases.' },
    '20TH': { code: '20TH', label: 'Anniversary', color: '#f59e0b', sortOrder: 25, isGradient: false, exclusiveSource: 'T4W4 2ND PRINT ONLY.' },
    SLR: { code: 'SLR', label: 'Secret Legend', color: '#f97316', sortOrder: 26, isGradient: true, exclusiveSource: 'T4 + EX packs ONLY. Black+White pairs. #6 Itachi = T4W1 ONLY.' },
    SCR: { code: 'SCR', label: 'Scroll Rare', color: '#f59e0b', sortOrder: 27, isGradient: true, exclusiveSource: 'YOUTH SCROLL BOX ONLY.' },
    SV: { code: 'SV', label: 'Scroll Variant', color: '#a855f7', sortOrder: 28, isGradient: true, exclusiveSource: 'HEAVEN+EARTH SCROLL ONLY. Gold+Silver. Gold Minato+Kakashi rarest.' },
    XR: { code: 'XR', label: 'Extreme Rare', color: '#3b82f6', sortOrder: 29, isGradient: true, exclusiveSource: 'Ninja Age ONLY. /720 (hidden /72).' },
};

export function getRarityInfo(rarity: string): RarityInfo {
    return RARITY_MAP[rarity] || { code: rarity, label: rarity, color: '#6b7280', sortOrder: 0, isGradient: false, exclusiveSource: '' };
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
    'T4': '#dc2626',
    'SP': '#ef4444',
    'EX': '#f97316',
    'BLISTER': '#fcd34d',
    'PIN': '#94a3b8',
};

export function getTierColor(tier: string): string {
    return TIER_COLORS[tier] || '#6b7280';
}

// Rainbow gradient CSS for SLR/SCR/XR/SV/NR
export const RAINBOW_GRADIENT = 'linear-gradient(135deg, #f97316, #ec4899, #8b5cf6, #3b82f6)';

// Variant options for collection UI
export const VARIANT_OPTIONS = [
    { value: 'standard', label: 'Standard' },
    { value: 'holo', label: 'Holographic' },
    { value: 'gold', label: 'Gold' },
    { value: 'silver', label: 'Silver' },
    { value: 'black', label: 'Black' },
    { value: 'white', label: 'White' },
    { value: 'diamond', label: 'Diamond' },
    { value: 'english', label: 'English' },
] as const;
