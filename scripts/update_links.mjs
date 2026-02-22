import fs from 'fs';
import path from 'path';

const setsDir = 'C:/Users/Jaydan/.gemini/antigravity/scratch/CardSite/src/content/sets';
const files = fs.readdirSync(setsDir).filter(f => f.endsWith('.json'));

for (const file of files) {
    const filePath = path.join(setsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    if (data.affiliateLinks) {
        const query = encodeURIComponent(`kayou naruto ${data.name}`);

        if (data.affiliateLinks.aliexpress === 'PLACEHOLDER' || !data.affiliateLinks.aliexpress) {
            data.affiliateLinks.aliexpress = `https://www.aliexpress.com/wholesale?SearchText=${query}`;
        }

        if (data.affiliateLinks.ebay === 'PLACEHOLDER' || !data.affiliateLinks.ebay) {
            data.affiliateLinks.ebay = `https://www.ebay.com/sch/i.html?_nkw=${query}`;
        }

        fs.writeFileSync(filePath, JSON.stringify(data, null, 4));
    }
}

console.log('Updated affiliate links.');
