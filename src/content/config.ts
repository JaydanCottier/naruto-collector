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

const caseSizeSchema = z.object({
    regular: z.number().optional().nullable(),
    master: z.number().optional().nullable(),
}).optional().nullable();

const boxVariantSchema = z.object({
    code: z.string().optional().nullable(),
    approxPriceUSD: z.number().optional().nullable(),
    packCount: z.number().optional().nullable(),
}).optional().nullable();

const boxVariantsSchema = z.object({
    sl: boxVariantSchema,
    lb: boxVariantSchema,
}).optional().nullable();

const cardBreakdownSchema = z.record(z.string(), z.number()).optional().nullable();

const setsCollection = defineCollection({
    type: 'data',
    schema: z.object({
        id: z.string(),
        slug: z.string(),
        officialCode: z.string().optional().nullable(),
        name: z.string(),
        shortName: z.string().optional().nullable(),
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
        boxesPerCarton: z.number().optional().nullable(),
        description: z.string().optional().nullable().default(''),
        logoImage: z.string().optional().nullable(),
        bannerImage: z.string().optional().nullable(),
        notes: z.string().optional().nullable().default(''),
        arc: z.string().optional().nullable(),
        unsealed: z.boolean().optional().nullable().default(false),
        isMaster: z.boolean().optional().nullable().default(false),
        waves: z.array(z.string()).optional().nullable(),
        englishEquivalent: z.string().optional().nullable(),
        englishEquivalents: z.array(z.string()).optional().nullable(),
        cnEquivalent: z.string().optional().nullable(),
        cnEquivalentCode: z.string().optional().nullable(),
        cnEquivalentLabel: z.string().optional().nullable(),
        region: z.enum(['CN', 'NA', 'SEA', 'GLOBAL']).optional().nullable().default('CN'),
        regions: z.array(z.string()).optional().nullable(),
        officialCodeShort: z.string().optional().nullable(),
        cnEquivalentShort: z.string().optional().nullable(),
        seaEquivalent: z.string().optional().nullable(),
        naEquivalent: z.string().optional().nullable(),
        caseSize: caseSizeSchema,
        boxVariants: boxVariantsSchema,
        cardBreakdown: cardBreakdownSchema,
        retailAvailability: z.array(z.string()).optional().nullable(),
        exclusiveCards: z.array(z.string()).optional().nullable(),
        approxPriceUSD: z.record(z.string(), z.number().nullable()).optional().nullable(),
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
            cardSerial: z.string().optional().nullable(),
            setId: z.string(),
            setSlug: z.string(),
            setPrefix: z.string().optional().nullable(),
            officialCode: z.string().optional().nullable(),
            cardCode: z.string().optional().nullable(),
            number: z.string(),
            cardNumber: z.string().optional().nullable(),
            name: z.string(),
            rarity: z.string(),
            type: z.string(),
            character: z.string().optional().nullable(),
            characterSlug: z.string().optional().nullable(),
            arc: z.string().optional().nullable(),
            region: z.string().optional().nullable(),
            image: z.string(),
            description: z.string().optional().nullable().default(''),
            variant: z.string().optional().nullable(),
            variants: z.array(z.string()).optional().nullable().default(['standard']),
            variantNotes: z.string().optional().nullable(),
            variantLevel: z.string().optional().nullable(),
            variantLevelDesc: z.string().optional().nullable(),
            serialLimit: z.number().optional().nullable(),
            isPuzzlePiece: z.boolean().optional().nullable().default(false),
            puzzleSet: z.string().optional().nullable(),
            exclusiveTo: z.string().optional().nullable(),
            appearsInTiers: z.array(z.string()).optional().nullable(),
            isPromo: z.boolean().optional().nullable(),
        })
    )
});

const figuresCollection = defineCollection({
    type: 'data',
    schema: z.array(
        z.object({
            id: z.string(),
            slug: z.string(),
            name: z.string(),
            character: z.string(),
            characterSlug: z.string(),
            figureType: z.enum(['regular', 'eternal', 'ultimate', 'big', 'chase-small']),
            xpCardId: z.string().optional().nullable(),
            image: z.string(),
        })
    )
});

export const collections = {
    'sets': setsCollection,
    'cards': cardsCollection,
    'figures': figuresCollection,
};
