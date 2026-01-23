
export const CURRENT_USER = {
    id: "usr_123",
    name: "Alex Rivera",
    email: "alex.rivera@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop",
    role: "STUDENT",
    walletAddress: "0x71C...9A23",
    balance: "ETH 2.45"
};

export const CATEGORIES = [
    { id: "cat_1", name: "Electronics", image: "https://images.unsplash.com/photo-1547489401-fcada4966052?fm=jpg&q=80&w=500&auto=format&fit=crop" },
    { id: "cat_2", name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=500&auto=format&fit=crop" },
    { id: "cat_3", name: "Home & Smart", image: "https://images.unsplash.com/photo-1519558260268-cde7e03a0152?fm=jpg&q=80&w=500&auto=format&fit=crop" },
    { id: "cat_4", name: "Books & Media", image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?q=80&w=500&auto=format&fit=crop" },
];

// --- TAGGED IMAGE BANK (100% Consistency) ---
// Each image is explicitly tagged with its type.

const ELEC_ASSETS = [
    { type: "Laptop", url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&q=80" }, // Fixed URL
    { type: "Headphone", url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80" },
    { type: "Camera", url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80" },
    { type: "Laptop", url: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&q=80" },
    { type: "Phone", url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&q=80" },
    { type: "Watch", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80" },
    { type: "Headphone", url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80" },
    { type: "Laptop", url: "https://images.unsplash.com/photo-1585338447937-7082f8fc763d?w=800&q=80" },
    { type: "Phone", url: "https://images.unsplash.com/photo-1560617544093-4740f1d51973?w=800&q=80" },
    { type: "Phone", url: "https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800&q=80" },
    { type: "Tablet", url: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80" },
    { type: "Laptop", url: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=800&q=80" },
    { type: "PC", url: "https://images.unsplash.com/photo-1551817958-c9c506811431?w=800&q=80" },
    { type: "Watch", url: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80" },
    { type: "Mouse", url: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=800&q=80" },
];

const FASH_ASSETS = [
    { type: "Shoe", url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80" },
    { type: "Shirt", url: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800&q=80" },
    { type: "Heels", url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80" },
    { type: "Shoe", url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80" },
    { type: "Bag", url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80" },
    { type: "Bag", url: "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=800&q=80" },
    { type: "Shirt", url: "https://images.unsplash.com/photo-1505022610485-0249ba5b3675?w=800&q=80" },
    { type: "Sweater", url: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80" },
    { type: "Kicks", url: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&q=80" },
    { type: "Hoodie", url: "https://images.unsplash.com/photo-1589465885857-44edb59ef526?w=800&q=80" },
    { type: "Shoe", url: "https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?w=800&q=80" },
    { type: "Blazer", url: "https://images.unsplash.com/photo-1509319117193-42d48fa0438d?w=800&q=80" },
];

const HOME_ASSETS = [
    { type: "Chair", url: "https://images.unsplash.com/photo-1550226891-ef816aed4a98?w=800&q=80" },
    { type: "Chair", url: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=800&q=80" },
    { type: "Chair", url: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80" },
    { type: "Lamp", url: "https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=800&q=80" },
    { type: "Chair", url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&q=80" },
    { type: "Shelf", url: "https://images.unsplash.com/photo-1583847661884-3b66d48c89c4?w=800&q=80" },
    { type: "Lamp", url: "https://images.unsplash.com/photo-1507473888900-52e1adad8134?w=800&q=80" },
    { type: "Flower", url: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=800&q=80" },
    { type: "Couch", url: "https://images.unsplash.com/photo-1522758971460-1d21eed7dc1d?w=800&q=80" },
    { type: "Pot", url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80" },
];

const BOOK_ASSETS = [
    { type: "Stack", url: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80" },
    { type: "Open", url: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80" },
    { type: "White", url: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&q=80" },
    { type: "Library", url: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80" },
    { type: "Book", url: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&q=80" },
    { type: "Store", url: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80" },
    { type: "Tech", url: "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=800&q=80" },
    { type: "Read", url: "https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=800&q=80" },
];

const ADJECTIVES = ["Pro", "Ultra", "Smart", "Sleek", "Modern", "Classic", "Hyper", "Neo", "Elite", "Prime"];

// Deterministic PRNG
function getSeededRandom(seed: number) {
    const x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
}

function generateTaggedProducts(category: string, baseId: string, count: number, assets: { type: string, url: string }[]) {
    return Array.from({ length: count }).map((_, i) => {
        // Strict round-robin cycling through assets array
        // We MUST use the asset at index `i` to guarantee the Type matches the Image.
        const asset = assets[i % assets.length];

        // Randomness
        const seed = i * category.length + baseId.length;
        const rand1 = getSeededRandom(seed);
        const rand2 = getSeededRandom(seed + 1);
        const rand3 = getSeededRandom(seed + 2);

        const adjective = ADJECTIVES[Math.floor(rand1 * ADJECTIVES.length)];

        return {
            id: `${baseId}_${i + 1}`,
            name: `${adjective} ${asset.type} ${Math.floor(rand2 * 900)}`,
            description: `A premium ${asset.type} selected from our verified collection. Authentic, high-quality, and ready to ship.`,
            price: Math.floor(rand1 * 800) + 40,
            originalPrice: rand3 > 0.6 ? Math.floor(rand1 * 800 * 1.2) : undefined,
            rating: parseFloat((3.8 + rand2 * 1.0).toFixed(1)),
            reviews: Math.floor(rand3 * 5000),
            image: asset.url,
            category: category,
            badge: i % 10 === 0 ? "Best Seller" : (i % 15 === 0 ? "New" : undefined),
            specs: ["Verified Stock", "Premium Build", "Warranty Included"],
            isDigitalTwin: i % 4 === 0,
            nftContract: undefined
        };
    });
}

export const PRODUCTS = [
    ...generateTaggedProducts("Electronics", "elec", 60, ELEC_ASSETS),
    ...generateTaggedProducts("Fashion", "fash", 60, FASH_ASSETS),
    ...generateTaggedProducts("Home & Smart", "home", 60, HOME_ASSETS),
    ...generateTaggedProducts("Books & Media", "book", 60, BOOK_ASSETS),
];

// Empty Cart initially
export const CART_ITEMS: { id: string; product: typeof PRODUCTS[0]; quantity: number }[] = [];

export const RECENT_ORDERS = [
    {
        id: "ord_98765",
        date: "Oct 24, 2025",
        total: 348.00,
        status: "Delivered",
        items: [PRODUCTS[0]]
    },
    {
        id: "ord_98764",
        date: "Sep 15, 2025",
        total: 189.99,
        status: "Processing",
        items: [PRODUCTS[10]]
    }
];
