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

// Obtener la URL de la imagen de un item del Steam Market
export const getSteamItemImageUrl = async (itemName, appId = '730') => {
    try {
        // Primero intentamos con la API de Wikipedia
        const searchResponse = await axios.get(`https://es.wikipedia.org/w/api.php`, {
            params: {
                action: 'query',
                list: 'search',
                srsearch: itemName,
                format: 'json',
                origin: '*'
            }
        });

        if (searchResponse.data.query.search.length > 0) {
            const pageId = searchResponse.data.query.search[0].pageid;
            
            // Obtener las imágenes de la página
            const imagesResponse = await axios.get(`https://es.wikipedia.org/w/api.php`, {
                params: {
                    action: 'query',
                    pageids: pageId,
                    prop: 'images',
                    format: 'json',
                    origin: '*'
                }
            });

            if (imagesResponse.data.query.pages[pageId].images.length > 0) {
                // Obtener la URL de la primera imagen
                const imageTitle = imagesResponse.data.query.pages[pageId].images[0].title;
                const imageInfoResponse = await axios.get(`https://es.wikipedia.org/w/api.php`, {
                    params: {
                        action: 'query',
                        titles: imageTitle,
                        prop: 'imageinfo',
                        iiprop: 'url',
                        format: 'json',
                        origin: '*'
                    }
                });

                const pages = imageInfoResponse.data.query.pages;
                const pageId = Object.keys(pages)[0];
                if (pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
                    return pages[pageId].imageinfo[0].url;
                }
            }
        }
    } catch (error) {
        console.log('Error al obtener imagen de Wikipedia:', error.message);
    }

    try {
        // Si falla Wikipedia, intentamos con la API de Pixabay
        const pixabayResponse = await axios.get(`https://pixabay.com/api/`, {
            params: {
                key: process.env.PIXABAY_API_KEY,
                q: itemName,
                image_type: 'photo',
                per_page: 1
            }
        });

        if (pixabayResponse.data.hits && pixabayResponse.data.hits.length > 0) {
            return pixabayResponse.data.hits[0].webformatURL;
        }
    } catch (error) {
        console.log('Error al obtener imagen de Pixabay:', error.message);
    }

    // Si todo falla, devolvemos null para que el frontend use su imagen por defecto
    return null;
}; 