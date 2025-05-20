import { getRandomPawnShopItem } from './steamMarket.service.js';

// Personalidades de clientes que afectan sus precios
const CLIENT_PERSONALITIES = {
    desesperado: {
        factor: 0.7, // Acepta 70% del valor real
        descripcion: "Necesita dinero urgentemente"
    },
    negociador: {
        factor: 0.9, // Quiere 90% del valor real
        descripcion: "Sabe el valor de sus objetos"
    },
    ambicioso: {
        factor: 1.2, // Pide 20% más del valor real
        descripcion: "Cree que sus objetos valen más"
    },
    realista: {
        factor: 1.0, // Pide el valor real
        descripcion: "Conoce el mercado"
    }
};

// Función para obtener una personalidad aleatoria
const getRandomPersonality = () => {
    const personalities = Object.keys(CLIENT_PERSONALITIES);
    return personalities[Math.floor(Math.random() * personalities.length)];
};

// Función para generar un cliente con un item
export const generateClient = async () => {
    try {
        // Obtener un item aleatorio
        const item = await getRandomPawnShopItem();
        
        // Seleccionar una personalidad aleatoria
        const personality = getRandomPersonality();
        const personalityData = CLIENT_PERSONALITIES[personality];
        
        // Calcular el precio solicitado basado en la personalidad
        const basePrice = item.requestedPrice;
        const requestedPrice = Math.round(basePrice * personalityData.factor);
        
        // Generar un nombre aleatorio para el cliente
        const clientNames = [
            "Juan Pérez", "María García", "Carlos López", "Ana Martínez",
            "Roberto Sánchez", "Laura Torres", "Miguel Rodríguez", "Sofía Díaz"
        ];
        const clientName = clientNames[Math.floor(Math.random() * clientNames.length)];

        return {
            name: clientName,
            personality: personality,
            personalityDescription: personalityData.descripcion,
            item: {
                ...item,
                requestedPrice: requestedPrice
            }
        };
    } catch (error) {
        console.error('Error al generar cliente:', error);
        return null;
    }
}; 