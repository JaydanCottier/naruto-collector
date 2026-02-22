import { test, expect } from '@playwright/test';

test.describe('Group E: English Sets Patch Verification @groupE', () => {

    test('E1: Navigate to /sets and click English tab. Verify headings appear.', async ({ page }) => {
        await page.goto('/sets');
        await page.click('button[data-filter="english"]');
        await expect(page.locator('h3:has-text("US Releases")')).toBeVisible();
        await expect(page.locator('h3:has-text("SEA Releases")')).toBeVisible();
        await expect(page.locator('h3:has-text("English Promos")')).toBeVisible();
    });

    test('E2: In /sets English tab, verify Heaven Scroll is under US and Chapter Jin is under SEA.', async ({ page }) => {
        await page.goto('/sets');
        await page.click('button[data-filter="english"]');

        // Check US section contains Heaven Scroll
        const usSection = page.locator('div').filter({ has: page.locator('h3:has-text("US Releases")') });
        await expect(usSection.locator('text="Heaven Scroll"')).toBeVisible();

        // Check SEA section contains Chapter Jin
        const seaSection = page.locator('div').filter({ has: page.locator('h3:has-text("SEA Releases")') });
        await expect(seaSection.locator('text="Chapter Jin"').first()).toBeVisible();
    });

    test('E3: In /sets English tab, verify Chapter Jin Series 2 appears in BOTH US and SEA sections.', async ({ page }) => {
        await page.goto('/sets');
        await page.click('button[data-filter="english"]');

        // Check US section contains Chapter Jin Series 2
        const usSection = page.locator('div').filter({ has: page.locator('h3:has-text("US Releases")') });
        await expect(usSection.locator('text="Chapter Jin Series 2"')).toBeVisible();

        // Check SEA section contains Chapter Jin Series 2
        const seaSection = page.locator('div').filter({ has: page.locator('h3:has-text("SEA Releases")') });
        await expect(seaSection.locator('text="Chapter Jin Series 2"')).toBeVisible();
    });

    test('E4: Navigate to /sets/heaven-scroll-s1. Verify US Release badge is present.', async ({ page }) => {
        await page.goto('/sets/heaven-scroll-s1');
        await expect(page.locator('span', { hasText: '🇺🇸 US Release' })).toBeVisible();
    });

    test('E5: On /sets/nrv01, verify SEA Release badge is present.', async ({ page }) => {
        await page.goto('/sets/nrv01');
        await expect(page.locator('span', { hasText: '🌏 SEA Release' })).toBeVisible();
    });

    test('E6: On /sets/jin-s2, verify Global Release badge is present.', async ({ page }) => {
        await page.goto('/sets/jin-s2');
        await expect(page.locator('span', { hasText: '🌐 Global Release' })).toBeVisible();
    });

    test('E7: On /sets/nrv01, verify cross-region banner says "US Collectors" and mentions "Heaven Scroll (NRSA01)".', async ({ page }) => {
        await page.goto('/sets/nrv01');
        const banner = page.locator('.bg-brand-surface.border.border-brand-border.rounded-xl.p-4', { hasText: 'US Collectors' });
        await expect(banner).toBeVisible();
        await expect(banner.locator('text="Heaven Scroll (NRSA01)"')).toBeVisible();
    });

    test('E8: Navigate to /sets/t4w6. Verify "Available in English as:" panel exists and lists Chapter Jin and Heaven Scroll.', async ({ page }) => {
        await page.goto('/sets/t4w6');
        const englishPanel = page.locator('div.bg-blue-500\\/10', { hasText: 'Available in English as:' });
        await expect(englishPanel).toBeVisible();
        await expect(englishPanel.locator('text="Chapter Jin"')).toBeVisible();
        await expect(englishPanel.locator('text="Heaven Scroll"')).toBeVisible();
    });

});
