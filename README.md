# Naruto Collector — KAYOU Card Reference & Collection Tracker

The complete index for all KAYOU Naruto trading card sets. Browse cards, track your collection, find what you need, and discover the best boxes to buy.

## ✨ Features

- **Comprehensive Database**: High-resolution metadata covering 34+ distinct official English and Chinese KAYOU Naruto card sets with set dimensions, rarities, and pull rates.
- **Client-Side Collection Tracking**: Privately document your owned inventory and variants in `localStorage`—no account required.
- **"Needs" & "Wishlist" Ecosystem**: Instantly isolate missing cards to complete your sets, or bookmark chase cards. Includes built-in one-click affiliate buying links to secure singles you're missing.
- **Ultra-Fast Search & Discovery**: Real-time fuzzy-text filtering by character, set ID, element, or language (`EN`/`CN`).
- **Data Portability**: JSON export/import functions for safely backing up and restoring your collection across devices.
- **Collector Resources**: Comprehensive breakdowns of card tiers, a visual **Rarity Guide**, and a beginner-friendly **"Start Here"** buying guide to prevent getting scammed.
- **Ninja-Themed Aesthetics**: Fully responsive, dark-mode-first glassmorphic UI matching the Naruto visual identity, powered by Tailwind CSS v4.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

## Production Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── content/
│   ├── sets/          # One JSON per set (34 sets)
│   ├── cards/         # One JSON array per set (8+ cards each)
│   └── config.ts      # Astro content collection schemas
├── components/
│   ├── affiliate/     # BuyButton, AffiliateDisclosure, BoxRecommendation
│   ├── collection/    # CollectionToggle, CollectionProgress, BackupWarning
│   ├── cards/         # RarityBadge
│   ├── sets/          # PullRateCard, CompleteYourSet
│   └── layout/        # Breadcrumb
├── layouts/           # BaseLayout, SetLayout
├── pages/
│   ├── index.astro           # Homepage
│   ├── sets/                 # Browse sets + set detail
│   ├── cards/                # Card detail
│   ├── characters/           # Character index + cross-set detail
│   ├── collection/           # Collection tracker (By Set + All Owned)
│   ├── needs/                # Missing cards with buy links
│   ├── wishlist/             # Starred cards with buy links
│   ├── start-here/           # Beginner buying guide
│   └── search.astro          # Full search page
├── utils/
│   ├── collection.ts         # localStorage: owned, wishlist, backup
│   └── rarity.ts             # Rarity colours, labels, tiers
└── styles/
    └── global.css            # Tailwind CSS theme + custom utilities
```

## Adding a New Set

1. Create `src/content/sets/[slug].json` with the set schema fields
2. Create `src/content/cards/[slug].json` with an array of card objects
3. Run `npm run build` to regenerate search index and static pages

## Adding Real Card Images

Drop `[card-id].jpg` files into `public/images/cards/`. The card ID format is `[set-slug]-[number]`, e.g., `t2w1-001.jpg`. Cards without images automatically show rarity-coloured placeholder SVGs.

## Updating Affiliate Links

Edit `affiliateLinks.aliexpress` in the relevant set JSON file under `src/content/sets/`. Replace the `PLACEHOLDER` URL with your actual AliExpress affiliate-tagged URL. Rebuild to see changes.

## Updating Prices

Edit `affiliateLinks.approxPriceUSD` in each set JSON. These appear on Set Cards, Set Detail pages, Buy Buttons, and the Start Here guide.

## Collection System

- Data stored in `localStorage` under key `naruto-collector-v1`
- Supports owned cards (with variant tracking) and wishlist (star) separately
- Auto-exports JSON backup every 10 cards added
- Shows backup warning banner if no export in 7+ days
- Export/import via JSON on the `/collection` page

## Deploying to Netlify

### Option 1: Git Integration (recommended)
Push to a Git repository and connect it to Netlify. It will auto-rebuild on every push using the `netlify.toml` config.

### Option 2: Manual Deploy
```bash
npm run build
# Then drag the `dist/` folder to Netlify's deploy page
```

## Tech Stack

- **Astro 5** — Static site generator
- **Tailwind CSS v4** — Utility-first styling
- **localStorage** — Client-side collection tracking (no auth needed)
- **Netlify** — Hosting with caching headers
