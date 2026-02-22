import fs from 'fs';
import path from 'path';

const distDir = path.join(process.cwd(), 'dist');
const allHtmlFiles = [];

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.html')) {
            allHtmlFiles.push(fullPath);
        }
    }
}

walk(distDir);
console.log(`Found ${allHtmlFiles.length} HTML files to audit.`);

const brokenLinks = [];

for (const htmlFile of allHtmlFiles) {
    const content = fs.readFileSync(htmlFile, 'utf8');

    // Extract hrefs and srcs
    const hrefMatches = content.matchAll(/href="([^"]+)"/g);
    const srcMatches = content.matchAll(/src="([^"]+)"/g);

    const linksToCheck = new Set();

    for (const match of hrefMatches) {
        let link = match[1];
        if (link.startsWith('http') || link.startsWith('mailto:') || link.startsWith('#') || link.startsWith('tel:')) continue;
        linksToCheck.add(JSON.stringify({ type: 'Link', url: link }));
    }

    for (const match of srcMatches) {
        let src = match[1];
        if (src.startsWith('http') || src.startsWith('data:')) continue;
        linksToCheck.add(JSON.stringify({ type: 'Image/Asset', url: src }));
    }

    for (const item of linksToCheck) {
        const { type, url } = JSON.parse(item);

        let cleanUrl = url.split('?')[0].split('#')[0];
        if (!cleanUrl) continue;

        let targetPath;
        if (cleanUrl.startsWith('/')) {
            targetPath = path.join(distDir, cleanUrl);
        } else {
            targetPath = path.resolve(path.dirname(htmlFile), cleanUrl);
        }

        // Let's decode URL components so %20 works
        targetPath = decodeURIComponent(targetPath);

        if (!path.extname(targetPath) || targetPath.endsWith('/') || targetPath.endsWith('\\')) {
            const asDirIndex = path.join(targetPath, 'index.html');
            const asHtml = targetPath + '.html';
            const asFile = targetPath;
            if (!fs.existsSync(asDirIndex) && !fs.existsSync(asHtml) && !fs.existsSync(asFile)) {
                brokenLinks.push({ source: htmlFile.replace(distDir, ''), target: url, type });
            }
        } else {
            if (!fs.existsSync(targetPath)) {
                brokenLinks.push({ source: htmlFile.replace(distDir, ''), target: url, type });
            }
        }
    }
}

const byTarget = {};
for (const b of brokenLinks) {
    if (!byTarget[b.target]) byTarget[b.target] = new Set();
    byTarget[b.target].add(b.source);
}

const uniqueBroken = Object.keys(byTarget);
console.log('\n--- AUDIT RESULTS ---');
if (uniqueBroken.length === 0) {
    console.log('✅ No 404s found!');
} else {
    console.log(`❌ Found ${uniqueBroken.length} broken targets:\n`);
    for (const target of uniqueBroken) {
        console.log(`[Target: ${target}]`);
        const sources = Array.from(byTarget[target]);
        console.log(`   Found in ${sources.length} pages, examples:`);
        sources.slice(0, 3).forEach(s => console.log(`   - ${s}`));
        console.log('');
    }
}
