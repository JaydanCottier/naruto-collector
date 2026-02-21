import { z, defineCollection } from 'astro:content';

const affiliateLinksSchema = z.object({
    aliexpress: z.string().optional().default(''),
    ebay: z.string().optional().default(''),
    approxPriceUSD: z.number().optional().default(0),
    approxPriceCNY: z.number().optional().default(0),
}).optional().nullable();

const pullRatesSchema = z.object({
    ur_per_packs: z.number().optional().default(0),
    hit_per_packs: z.number().optional().default(0),
    valueRating: z.number().optional().default(3),
}).optional().nullable();

const setsCollection = defineCollection({
    type: 'data',
    schema: z.object({
        id: z.string(),
        slug: z.string(),
        name: z.string(),
        displayName: z.string().optional().nullable(),
        tier: z.string(),
        wave: z.number().optional().nullable(),
        series: z.string().optional().nullable(),
        type: z.string(),
        language: z.string(),
        releaseDate: z.string(),
        cardCount: z.number().optional().nullable(),
        packCount: z.number().optional().nullable(),
        packPrice: z.string().optional().nullable(),
        packContents: z.string().optional().nullable(),
        description: z.string().optional().nullable().default(''),
        logoImage: z.string().optional().nullable(),
        bannerImage: z.string().optional().nullable(),
        notes: z.string().optional().nullable().default(''),
        arc: z.string().optional().nullable(),
        unsealed: z.boolean().optional().nullable().default(false),
        englishEquivalent: z.string().optional().nullable(),
        cnEquivalent: z.string().optional().nullable(),
        affiliateLinks: affiliateLinksSchema,
        pullRates: pullRatesSchema,
    })
});

const cardsCollection = defineCollection({
    type: 'data',
    schema: z.array(
        z.object({
            id: z.string(),
            slug: z.string(),
            setId: z.string(),
            setSlug: z.string(),
            number: z.string(),
            name: z.string(),
            rarity: z.string(),
            type: z.string(),
            character: z.string().optional().nullable(),
            characterSlug: z.string().optional().nullable(),
            arc: z.string().optional().nullable(),
            image: z.string(),
            description: z.string().optional().nullable().default(''),
            variant: z.string().optional().nullable(),
            variants: z.array(z.string()).optional().nullable().default(['standard']),
            variantNotes: z.string().optional().nullable(),
            serialLimit: z.number().optional().nullable(),
            isPuzzlePiece: z.boolean().optional().nullable().default(false),
            puzzleSet: z.string().optional().nullable(),
            exclusiveTo: z.string().optional().nullable(),
            appearsInTiers: z.array(z.string()).optional().nullable(),
            isPromo: z.boolean().optional().nullable(),
        })
    )
});

export const collections = {
    'sets': setsCollection,
    'cards': cardsCollection,
};
