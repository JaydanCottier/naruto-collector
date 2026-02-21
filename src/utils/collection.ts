// localStorage collection helpers — full spec implementation
// Key: "naruto-collector-v1"
// Supports: owned (with variant), wishlist, backup tracking, auto-export

const STORAGE_KEY = 'naruto-collector-v1';
const AUTO_EXPORT_INTERVAL = 10; // trigger download every N new cards

export interface OwnedEntry {
    owned: true;
    variant: 'standard' | 'holo' | 'serialized' | 'promo' | 'english';
    addedAt: string;
}

export interface CollectionData {
    version: number;
    lastExported: string | null;
    lastModified: string;
    owned: Record<string, OwnedEntry>;
    wishlist: Record<string, boolean>;
    _addCountSinceExport?: number;
}

function getDefaultCollection(): CollectionData {
    return {
        version: 1,
        lastExported: null,
        lastModified: new Date().toISOString(),
        owned: {},
        wishlist: {},
        _addCountSinceExport: 0,
    };
}

export function getCollection(): CollectionData {
    if (typeof window === 'undefined') return getDefaultCollection();
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return getDefaultCollection();
        const data = JSON.parse(raw) as CollectionData;
        // Migrate old format (owned was Record<string, boolean>)
        if (data.owned) {
            for (const [id, val] of Object.entries(data.owned)) {
                if (val === true || (val as any) === false) {
                    if (val) {
                        (data.owned as any)[id] = { owned: true, variant: 'standard', addedAt: new Date().toISOString() };
                    } else {
                        delete data.owned[id];
                    }
                }
            }
        }
        if (!data.wishlist) data.wishlist = {};
        if (!data.lastExported) data.lastExported = null;
        if (!data._addCountSinceExport) data._addCountSinceExport = 0;
        return data;
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
            addedAt: new Date().toISOString(),
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

export function getVariant(cardId: string): string {
    const collection = getCollection();
    return collection.owned[cardId]?.variant || 'standard';
}

export function setVariant(cardId: string, variant: OwnedEntry['variant']): void {
    const collection = getCollection();
    if (collection.owned[cardId]) {
        collection.owned[cardId].variant = variant;
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
    if (ownedCount === 0) return false; // no point warning if nothing to back up
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
    a.download = `naruto-collection-${date}.json`;
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
        const data = JSON.parse(json) as CollectionData;
        if (data.version && data.owned) {
            saveCollection(data);
            return true;
        }
        return false;
    } catch {
        return false;
    }
}
