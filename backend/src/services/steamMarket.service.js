import axios from 'axios';

const STEAM_API_URL = 'https://steamcommunity.com/market/priceoverview/';

// Categorías de items con sus respectivos nombres en Steam Market
const PAWN_SHOP_CATEGORIES = {
    relojes: [
        'Chronograph Watch',
        'Vintage Watch',
        'Luxury Watch',
        'Pocket Watch'
    ],
    joyeria: [
        'Gold Chain',
        'Diamond Ring',
        'Silver Necklace',
        'Pearl Earrings'
    ],
    antiguedades: [
        'Antique Vase',
        'Vintage Camera',
        'Old Coin',
        'Antique Clock'
    ],
    arte: [
        'Oil Painting',
        'Sculpture',
        'Vintage Poster',
        'Art Print'
    ],
    coleccionables: [
        'Rare Stamp',
        'Trading Card',
        'Comic Book',
        'Collectible Figure'
    ]
};

// Función para obtener una categoría aleatoria
const getRandomCategory = () => {
    const categories = Object.keys(PAWN_SHOP_CATEGORIES);
    return categories[Math.floor(Math.random() * categories.length)];
};

// Función para obtener un item aleatorio de una categoría
const getRandomItemFromCategory = (category) => {
    const items = PAWN_SHOP_CATEGORIES[category];
    return items[Math.floor(Math.random() * items.length)];
};

export const getSteamItemPrice = async (itemName, appId = '730') => {
    try {
        const response = await axios.get(STEAM_API_URL, {
            params: {
                appid: appId,
                market_hash_name: itemName,
                currency: 1 // USD
            }
        });

        if (response.data.success) {
            // Redondear el precio a números más amigables para el juego
            const price = parseFloat(response.data.lowest_price.replace('$', ''));
            return Math.round(price * 100) / 100; // Redondear a 2 decimales
        }
        
        return null;
    } catch (error) {
        console.error('Error al obtener precio de Steam:', error);
        return null;
    }
};

// Función para obtener un precio aleatorio basado en el precio real
export const getRandomizedPrice = (basePrice) => {
    if (!basePrice) return null;
    
    // Añadir una variación aleatoria entre -10% y +10%
    const variation = (Math.random() * 0.2 - 0.1) * basePrice;
    const finalPrice = basePrice + variation;
    
    // Redondear a múltiplos de 5 para hacer los precios más "jugables"
    return Math.round(finalPrice / 5) * 5;
};

// Nueva función para obtener un item aleatorio con precio
export const getRandomPawnShopItem = async () => {
    const category = getRandomCategory();
    const itemName = getRandomItemFromCategory(category);
    const steamPrice = await getSteamItemPrice(itemName);
    const randomizedPrice = getRandomizedPrice(steamPrice);

    return {
        name: itemName,
        category,
        requestedPrice: randomizedPrice || 100,
        condition: getRandomCondition()
    };
};

// Función para obtener una condición aleatoria
const getRandomCondition = () => {
    const conditions = ['Excelente', 'Bueno', 'Regular', 'Usado'];
    return conditions[Math.floor(Math.random() * conditions.length)];
}; 