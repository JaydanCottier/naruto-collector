// Collection Manager — v3 (cards + figures)
// Storage key: naruto-collector-v3

const STORAGE_KEY = 'naruto-collector-v3';
const V2_KEY = 'naruto-collector-v2';
const V1_KEY = 'naruto-collector-v1';

export type Variant = 'standard' | 'holo' | 'gold' | 'silver' | 'black' | 'white' | 'diamond' | 'english' | 'SLR+' | 'SLR-' | 'SV-S' | 'SV-G';
export type FigureVariant = 'regular' | 'eternal' | 'ultimate' | 'big' | 'chase-small';

export interface OwnedEntry {
    owned: boolean;
    variant: Variant;
    quantity: number;
    addedAt: string;
    notes: string;
}

export interface FigureEntry {
    owned: boolean;
    variant: FigureVariant;
    quantity: number;
    addedAt: string;
}

export interface CollectionData {
    version: number;
    lastExported: string | null;
    lastModified: string;
    owned: Record<string, OwnedEntry>;
    wishlist: Record<string, boolean>;
    figures: Record<string, FigureEntry>;
    _addCountSinceExport?: number;
}

function createEmpty(): CollectionData {
    return {
        version: 3,
        lastExported: null,
        lastModified: new Date().toISOString(),
        owned: {},
        wishlist: {},
        figures: {},
        _addCountSinceExport: 0,
    };
}

function migrateV1(raw: any): CollectionData {
    const data = createEmpty();
    if (raw && typeof raw === 'object') {
        if (raw.owned && typeof raw.owned === 'object') {
            for (const [id, val] of Object.entries(raw.owned)) {
                if (val && typeof val === 'object') {
                    const entry = val as any;
                    data.owned[id] = {
                        owned: true,
                        variant: entry.variant || 'standard',
                        quantity: 1,
                        addedAt: entry.addedAt || new Date().toISOString(),
                        notes: '',
                    };
                } else if (val === true) {
                    data.owned[id] = {
                        owned: true,
                        variant: 'standard',
                        quantity: 1,
                        addedAt: new Date().toISOString(),
                        notes: '',
                    };
                }
            }
        }
        if (raw.wishlist) data.wishlist = raw.wishlist;
        if (raw.lastExported) data.lastExported = raw.lastExported;
        if (raw.lastModified) data.lastModified = raw.lastModified;
    }
    return data;
}

function migrateV2(raw: any): CollectionData {
    const data = createEmpty();
    if (raw && typeof raw === 'object') {
        data.owned = raw.owned || {};
        data.wishlist = raw.wishlist || {};
        data.lastExported = raw.lastExported || null;
        data.lastModified = raw.lastModified || new Date().toISOString();
        data._addCountSinceExport = raw._addCountSinceExport || 0;
        // v2 had no figures field — that's the only new thing in v3
        data.figures = {};
    }
    return data;
}

export function getCollection(): CollectionData {
    if (typeof window === 'undefined') return createEmpty();

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
        try {
            const parsed = JSON.parse(raw);
            if (!parsed.figures) parsed.figures = {};
            return parsed;
        } catch { return createEmpty(); }
    }

    // Auto-migrate from v2
    const v2Raw = localStorage.getItem(V2_KEY);
    if (v2Raw) {
        try {
            const migrated = migrateV2(JSON.parse(v2Raw));
            saveCollection(migrated);
            return migrated;
        } catch { /* fall through */ }
    }

    // Auto-migrate from v1
    const v1Raw = localStorage.getItem(V1_KEY);
    if (v1Raw) {
        try {
            const migrated = migrateV1(JSON.parse(v1Raw));
            saveCollection(migrated);
            return migrated;
        } catch { /* fall through */ }
    }

    return createEmpty();
}

export function saveCollection(data: CollectionData): void {
    if (typeof window === 'undefined') return;
    data.version = 3;
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function isOwned(cardId: string): boolean {
    const col = getCollection();
    return col.owned[cardId]?.owned === true;
}

export function isWishlisted(cardId: string): boolean {
    const col = getCollection();
    return col.wishlist[cardId] === true;
}

export function toggleOwned(cardId: string): boolean {
    const col = getCollection();
    if (col.owned[cardId]?.owned) {
        delete col.owned[cardId];
        saveCollection(col);
        return false;
    } else {
        col.owned[cardId] = {
            owned: true,
            variant: 'standard',
            quantity: 1,
            addedAt: new Date().toISOString(),
            notes: '',
        };
        col._addCountSinceExport = (col._addCountSinceExport || 0) + 1;
        saveCollection(col);
        checkAutoExport(col);
        return true;
    }
}

export function toggleWishlist(cardId: string): boolean {
    const col = getCollection();
    if (col.wishlist[cardId]) {
        delete col.wishlist[cardId];
        saveCollection(col);
        return false;
    } else {
        col.wishlist[cardId] = true;
        saveCollection(col);
        return true;
    }
}

export function setVariant(cardId: string, variant: Variant): void {
    const col = getCollection();
    if (col.owned[cardId]) {
        col.owned[cardId].variant = variant;
        saveCollection(col);
    }
}

export function setQuantity(cardId: string, quantity: number): void {
    const col = getCollection();
    if (col.owned[cardId]) {
        col.owned[cardId].quantity = Math.max(1, quantity);
        saveCollection(col);
    }
}

export function setNotes(cardId: string, notes: string): void {
    const col = getCollection();
    if (col.owned[cardId]) {
        col.owned[cardId].notes = notes;
        saveCollection(col);
    }
}

// Figure collection functions
export function isFigureOwned(figureId: string): boolean {
    const col = getCollection();
    return col.figures[figureId]?.owned === true;
}

export function toggleFigureOwned(figureId: string, variant: FigureVariant = 'regular'): boolean {
    const col = getCollection();
    if (col.figures[figureId]?.owned) {
        delete col.figures[figureId];
        saveCollection(col);
        return false;
    } else {
        col.figures[figureId] = {
            owned: true,
            variant: variant,
            quantity: 1,
            addedAt: new Date().toISOString(),
        };
        saveCollection(col);
        return true;
    }
}

export function getFigureCount(): number {
    const col = getCollection();
    return Object.values(col.figures).filter(f => f.owned).length;
}

export function getOwnedCount(): number {
    const col = getCollection();
    return Object.values(col.owned).filter(o => o.owned).length;
}

export function getWishlistCount(): number {
    const col = getCollection();
    return Object.values(col.wishlist).filter(Boolean).length;
}

function checkAutoExport(col: CollectionData): void {
    if ((col._addCountSinceExport || 0) >= 10) {
        // Trigger auto-export warning — handled by BackupWarning component
    }
}

export function needsBackupWarning(): boolean {
    const col = getCollection();
    if (!col.lastExported) {
        return getOwnedCount() >= 10;
    }
    const daysSince = (Date.now() - new Date(col.lastExported).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince >= 7 || (col._addCountSinceExport || 0) >= 10;
}

export function exportCollection(): string {
    const col = getCollection();
    col.lastExported = new Date().toISOString();
    col._addCountSinceExport = 0;
    saveCollection(col);

    const blob = JSON.stringify(col, null, 2);
    const date = new Date().toISOString().slice(0, 10);
    const filename = `naruto-collector-backup-${date}.json`;

    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([blob], { type: 'application/json' }));
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);

    return filename;
}

export function importCollection(json: string): { success: boolean; cardCount: number; figureCount: number; error?: string } {
    try {
        const data = JSON.parse(json);
        if (!data.owned || typeof data.owned !== 'object') {
            return { success: false, cardCount: 0, figureCount: 0, error: 'Invalid collection format' };
        }
        if (!data.figures) data.figures = {};
        data.version = 3;
        data.lastModified = new Date().toISOString();
        saveCollection(data);
        const cardCount = Object.values(data.owned).filter((o: any) => o.owned).length;
        const figureCount = Object.values(data.figures).filter((f: any) => f.owned).length;
        return { success: true, cardCount, figureCount };
    } catch (e) {
        return { success: false, cardCount: 0, figureCount: 0, error: 'Invalid JSON' };
    }
}

export { STORAGE_KEY };
