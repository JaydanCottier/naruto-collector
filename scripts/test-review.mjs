import { chromium } from 'playwright';
import fs from 'fs';

const pages = [
    { url: 'https://naruto-collector.netlify.app/', name: 'homepage' },
    { url: 'https://naruto-collector.netlify.app/sets', name: 'sets' },
    { url: 'https://naruto-collector.netlify.app/sets/t2w1', name: 'sets_t2w1' },
    { url: 'https://naruto-collector.netlify.app/sets/t4w1', name: 'sets_t4w1' },
    { url: 'https://naruto-collector.netlify.app/sets/t2w7', name: 'sets_t2w7' },
    { url: 'https://naruto-collector.netlify.app/sets/heaven-scroll-s1', name: 'sets_heaven' },
    { url: 'https://naruto-collector.netlify.app/cards/t2w1-001-naruto-uzumaki', name: 'cards_t2w1_001' },
    { url: 'https://naruto-collector.netlify.app/collection', name: 'collection' },
    { url: 'https://naruto-collector.netlify.app/needs', name: 'needs' },
    { url: 'https://naruto-collector.netlify.app/rarity-guide', name: 'rarity' },
    { url: 'https://naruto-collector.netlify.app/start-here', name: 'start' },
    { url: 'https://naruto-collector.netlify.app/figures', name: 'figures' }
];

const outDir = 'C:/Users/Jaydan/.gemini/antigravity/brain/97c8a514-005e-485d-b63a-0a38744b14e3';
const results = [];

(async () => {
    const browser = await chromium.launch();
    const context = await browser.newContext();

    for (const pageInfo of pages) {
        console.log(`Checking ${pageInfo.name}...`);
        const pageObj = await context.newPage();
        const consoleLogs = [];

        pageObj.on('console', msg => {
            if (msg.type() === 'error' || msg.type() === 'warning') {
                consoleLogs.push({ type: msg.type(), text: msg.text() });
            }
        });

        pageObj.on('pageerror', error => {
            consoleLogs.push({ type: 'pageerror', text: error.message });
        });

        try {
            const response = await pageObj.goto(pageInfo.url, { waitUntil: 'networkidle' });
            const status = response ? response.status() : 0;

            await pageObj.setViewportSize({ width: 1280, height: 800 });
            await pageObj.screenshot({ path: `${outDir}/${pageInfo.name}_desktop.png`, fullPage: true });

            await pageObj.setViewportSize({ width: 375, height: 667 });
            await pageObj.screenshot({ path: `${outDir}/${pageInfo.name}_mobile.png`, fullPage: true });

            const title = await pageObj.title();
            const bodyText = await pageObj.innerText('body');
            fs.writeFileSync(`${outDir}/${pageInfo.name}.txt`, bodyText);

            results.push({
                url: pageInfo.url,
                name: pageInfo.name,
                ok: true,
                status,
                title,
                logs: consoleLogs
            });
        } catch (e) {
            console.error(e);
            results.push({ url: pageInfo.url, name: pageInfo.name, ok: false, error: e.message });
        }

        await pageObj.close();
    }

    fs.writeFileSync(`${outDir}/results.json`, JSON.stringify(results, null, 2));
    await browser.close();
    console.log('Done.');
})();
