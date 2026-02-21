// localStorage collection helpers — v2 spec
// Key: "naruto-collector-v2"
// Supports: owned (with variant, quantity, notes), wishlist, backup tracking, auto-export

const STORAGE_KEY = 'naruto-collector-v2';
const LEGACY_KEY = 'naruto-collector-v1';
const AUTO_EXPORT_INTERVAL = 10;

export type VariantType = 'standard' | 'holo' | 'gold' | 'silver' | 'black' | 'white' | 'diamond' | 'english';

export interface OwnedEntry {
    owned: boolean;
    variant: VariantType;
    quantity: number;
    addedAt: string;
    notes: string;
}

export interface CollectionData {
    version: 2;
    lastExported: string | null;
    lastModified: string;
    owned: Record<string, OwnedEntry>;
    wishlist: Record<string, boolean>;
    _addCountSinceExport?: number;
}

function getDefaultCollection(): CollectionData {
    return {
        version: 2,
        lastExported: null,
        lastModified: new Date().toISOString(),
        owned: {},
        wishlist: {},
        _addCountSinceExport: 0,
    };
}

/** Migrate v1 data to v2 format */
function migrateV1toV2(v1Data: any): CollectionData {
    const data = getDefaultCollection();
    if (v1Data.owned) {
        for (const [id, val] of Object.entries(v1Data.owned)) {
            if (val === true) {
                data.owned[id] = { owned: true, variant: 'standard', quantity: 1, addedAt: new Date().toISOString(), notes: '' };
            } else if (val && typeof val === 'object') {
                const entry = val as any;
                data.owned[id] = {
                    owned: entry.owned ?? true,
                    variant: entry.variant || 'standard',
                    quantity: entry.quantity || 1,
                    addedAt: entry.addedAt || new Date().toISOString(),
                    notes: entry.notes || '',
                };
            }
        }
    }
    if (v1Data.wishlist) {
        data.wishlist = v1Data.wishlist;
    }
    if (v1Data.lastExported) data.lastExported = v1Data.lastExported;
    if (v1Data.lastModified) data.lastModified = v1Data.lastModified;
    if (v1Data._addCountSinceExport) data._addCountSinceExport = v1Data._addCountSinceExport;
    return data;
}

export function getCollection(): CollectionData {
    if (typeof window === 'undefined') return getDefaultCollection();
    try {
        // Check for v2 first
        let raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const data = JSON.parse(raw) as CollectionData;
            // Ensure all owned entries have full structure
            if (data.owned) {
                for (const [id, val] of Object.entries(data.owned)) {
                    if (typeof val !== 'object' || val === null) {
                        data.owned[id] = { owned: true, variant: 'standard', quantity: 1, addedAt: new Date().toISOString(), notes: '' };
                    } else {
                        if (!val.quantity) val.quantity = 1;
                        if (!val.notes) val.notes = '';
                        if (!val.variant) val.variant = 'standard';
                    }
                }
            }
            if (!data.wishlist) data.wishlist = {};
            if (!data.lastExported) data.lastExported = null;
            if (!data._addCountSinceExport) data._addCountSinceExport = 0;
            return data;
        }

        // Try migrating from v1
        raw = localStorage.getItem(LEGACY_KEY);
        if (raw) {
            const v1Data = JSON.parse(raw);
            const v2Data = migrateV1toV2(v1Data);
            saveCollection(v2Data);
            // Clean up legacy key
            localStorage.removeItem(LEGACY_KEY);
            return v2Data;
        }

        return getDefaultCollection();
    } catch {
        return getDefaultCollection();
    }
}

export function saveCollection(data: CollectionData): void {
    if (typeof window === 'undefined') return;
    data.lastModified = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

// --- Owned ---

export function isOwned(cardId: string): boolean {
    const collection = getCollection();
    return !!collection.owned[cardId];
}

export function toggleOwned(cardId: string): boolean {
    const collection = getCollection();
    if (collection.owned[cardId]) {
        delete collection.owned[cardId];
        saveCollection(collection);
        return false;
    } else {
        collection.owned[cardId] = {
            owned: true,
            variant: 'standard',
            quantity: 1,
            addedAt: new Date().toISOString(),
            notes: '',
        };
        collection._addCountSinceExport = (collection._addCountSinceExport || 0) + 1;
        saveCollection(collection);
        // Auto-export check
        if ((collection._addCountSinceExport || 0) >= AUTO_EXPORT_INTERVAL) {
            triggerAutoExport(collection);
        }
        return true;
    }
}

// Legacy compat
export function toggleCard(cardId: string): boolean {
    return toggleOwned(cardId);
}

// --- Variant ---

export function getVariant(cardId: string): VariantType {
    const collection = getCollection();
    return collection.owned[cardId]?.variant || 'standard';
}

export function setVariant(cardId: string, variant: VariantType): void {
    const collection = getCollection();
    if (collection.owned[cardId]) {
        collection.owned[cardId].variant = variant;
        saveCollection(collection);
    }
}

// --- Quantity ---

export function getQuantity(cardId: string): number {
    const collection = getCollection();
    return collection.owned[cardId]?.quantity || 0;
}

export function setQuantity(cardId: string, quantity: number): void {
    const collection = getCollection();
    if (collection.owned[cardId]) {
        collection.owned[cardId].quantity = Math.max(1, quantity);
        saveCollection(collection);
    }
}

// --- Notes ---

export function getNotes(cardId: string): string {
    const collection = getCollection();
    return collection.owned[cardId]?.notes || '';
}

export function setNotes(cardId: string, notes: string): void {
    const collection = getCollection();
    if (collection.owned[cardId]) {
        collection.owned[cardId].notes = notes;
        saveCollection(collection);
    }
}

// --- Wishlist ---

export function isWishlisted(cardId: string): boolean {
    const collection = getCollection();
    return !!collection.wishlist[cardId];
}

export function toggleWishlist(cardId: string): boolean {
    const collection = getCollection();
    if (collection.wishlist[cardId]) {
        delete collection.wishlist[cardId];
    } else {
        collection.wishlist[cardId] = true;
    }
    saveCollection(collection);
    return !!collection.wishlist[cardId];
}

// --- Counts ---

export function getOwnedCount(cardIds: string[]): number {
    const collection = getCollection();
    return cardIds.filter(id => collection.owned[id]).length;
}

export function getOwnedCardIds(): string[] {
    const collection = getCollection();
    return Object.keys(collection.owned);
}

export function getWishlistCardIds(): string[] {
    const collection = getCollection();
    return Object.keys(collection.wishlist);
}

// --- Backup ---

export function shouldShowBackupWarning(): boolean {
    const collection = getCollection();
    const ownedCount = Object.keys(collection.owned).length;
    if (ownedCount === 0) return false;
    if (!collection.lastExported) return true;
    const daysSinceExport = (Date.now() - new Date(collection.lastExported).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceExport > 7;
}

export function getDaysSinceExport(): number | null {
    const collection = getCollection();
    if (!collection.lastExported) return null;
    return Math.floor((Date.now() - new Date(collection.lastExported).getTime()) / (1000 * 60 * 60 * 24));
}

export function markExported(): void {
    const collection = getCollection();
    collection.lastExported = new Date().toISOString();
    collection._addCountSinceExport = 0;
    saveCollection(collection);
}

// --- Export / Import ---

export function exportCollection(): string {
    return JSON.stringify(getCollection(), null, 2);
}

export function triggerDownload(data: CollectionData): void {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().slice(0, 10);
    a.download = `naruto-collector-backup-${date}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function triggerAutoExport(data: CollectionData): void {
    data._addCountSinceExport = 0;
    data.lastExported = new Date().toISOString();
    saveCollection(data);
    triggerDownload(data);
}

export function importCollection(json: string): boolean {
    try {
        const data = JSON.parse(json);
        // Handle v1 imports
        if (data.version === 1 || !data.version) {
            const v2 = migrateV1toV2(data);
            saveCollection(v2);
            return true;
        }
        if (data.version === 2 && data.owned) {
            saveCollection(data as CollectionData);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}
