export type CollectingMode = 'set' | 'rarity';

export function getCollectingMode(): CollectingMode {
    if (typeof localStorage === 'undefined') return 'set';
    return (localStorage.getItem('naruto-collector-mode') as CollectingMode) || 'set';
}

export function setCollectingMode(mode: CollectingMode): void {
    localStorage.setItem('naruto-collector-mode', mode);
    window.dispatchEvent(new CustomEvent('collecting-mode-change', { detail: { mode } }));
}
