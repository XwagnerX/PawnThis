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

// Mapeo de categorías a términos de búsqueda específicos
const CATEGORY_SEARCH_TERMS = {
    relojes: ['vintage watch', 'luxury watch', 'antique clock'],
    joyeria: ['silver necklace', 'gold jewelry', 'diamond ring', 'pearl earrings'],
    antiguedades: ['antique vase', 'vintage camera', 'old coin', 'antique clock'],
    arte: ['oil painting', 'sculpture', 'vintage poster', 'art print'],
    coleccionables: ['rare stamp', 'trading card', 'comic book', 'collectible figure']
};

// Obtener la URL de la imagen de un item del Steam Market
export const getSteamItemImageUrl = async (itemName, appId = '730') => {
    try {
        // Usar la API de Unsplash para buscar imágenes específicas
        const response = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: itemName,
                per_page: 1,
                orientation: 'squarish'
            },
            headers: {
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });

        if (response.data.results && response.data.results.length > 0) {
            return response.data.results[0].urls.regular;
        }

        // Si no hay resultados, intentar con una búsqueda más genérica
        const categoryResponse = await axios.get('https://api.unsplash.com/search/photos', {
            params: {
                query: itemName.split(' ')[0], // Usar solo la primera palabra
                per_page: 1,
                orientation: 'squarish'
            },
            headers: {
                'Authorization': `Client-ID ${process.env.UNSPLASH_ACCESS_KEY}`
            }
        });

        if (categoryResponse.data.results && categoryResponse.data.results.length > 0) {
            return categoryResponse.data.results[0].urls.regular;
        }

        throw new Error('No se encontraron imágenes');
    } catch (error) {
        console.log('Error al obtener imagen de Unsplash:', error.message);
        // Si falla, devolvemos una imagen de placeholder personalizada
        return `https://placehold.co/400x400/412008/FEFFD4?text=${encodeURIComponent(itemName)}`;
    }
}; 