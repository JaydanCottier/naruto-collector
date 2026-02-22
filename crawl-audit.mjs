import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:4321';
const visited = new Set();
const queue = [BASE_URL];
const errors = [];

async function crawl() {
    console.log('Starting site crawler...');
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    // Listen for page errors
    page.on('pageerror', err => {
        errors.push(`JS Error on ${page.url()}: ${err.message}`);
    });

    while (queue.length > 0) {
        let currentUrl = queue.shift();

        // normalize URL
        if (currentUrl !== BASE_URL && currentUrl.endsWith('/')) {
            currentUrl = currentUrl.slice(0, -1);
        }

        if (visited.has(currentUrl)) continue;
        visited.add(currentUrl);

        console.log(`Visiting (${visited.size}): ${currentUrl}`);

        let response;
        try {
            response = await page.goto(currentUrl, { waitUntil: 'domcontentloaded', timeout: 10000 });
        } catch (e) {
            errors.push(`[FAILED TO LOAD] ${currentUrl}: ${e.message}`);
            continue;
        }

        if (response && !response.ok()) {
            errors.push(`[HTTP ${response.status()}] ${currentUrl}`);
            continue; // if 404, don't parse links
        }

        // Check for broken images (we will ignore images without a src or external images, only check internal ones if any)
        // Also wait a tiny bit for images to load, since DOM content loaded might not mean naturally width > 0
        await page.waitForTimeout(500);

        const brokenImages = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('img'))
                .filter(img => {
                    // if it's an external tracker or pixel, ignore.
                    if (img.src && img.src.includes('pixel')) return false;
                    return img.naturalWidth === 0 || img.naturalHeight === 0;
                })
                .map(img => img.src || img.getAttribute('src'));
        });

        if (brokenImages.length > 0) {
            errors.push(`[BROKEN IMAGES] on ${currentUrl}:\n  - ` + brokenImages.join('\n  - '));
        }

        // Extract internal links
        const links = await page.evaluate(() => {
            return Array.from(document.querySelectorAll('a'))
                .map(a => a.href)
                .filter(href => href.startsWith(window.location.origin) && !href.includes('#'));
        });

        // Add to queue
        for (const link of links) {
            let normalized = link;
            if (normalized !== BASE_URL && normalized.endsWith('/')) {
                normalized = normalized.slice(0, -1);
            }
            if (!visited.has(normalized) && !queue.includes(normalized)) {
                queue.push(normalized);
            }
        }
    }

    await browser.close();

    console.log('\n--- CRAWL COMPLETE ---');
    console.log(`Total Pages Visited: ${visited.size}`);

    if (errors.length > 0) {
        console.log(`\nFound ${errors.length} Issues:`);
        errors.forEach(e => console.log(e));
    } else {
        console.log('\n✅ No 404s or broken images found!');
    }
}

crawl().catch(console.error);
