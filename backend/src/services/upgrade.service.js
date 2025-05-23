// Configuración de mejoras
const UPGRADE_CONFIG = {
    inventory_space: {
        name: 'Espacio de Inventario',
        description: 'Aumenta el espacio disponible para almacenar objetos',
        levels: [
            { price: 500, bonus: 5 },
            { price: 1000, bonus: 10 },
            { price: 2000, bonus: 15 }
        ]
    },
    fast_sale: {
        name: 'Ventas Rápidas',
        description: 'Optimiza tus procesos y estrategias para vender objetos más rápido',
        levels: [
            { price: 1000, bonus: 5 },  // 5% de reducción
            { price: 2200, bonus: 10 }, // 10% de reducción
            { price: 4500, bonus: 15 }  // 15% de reducción
        ]
    },
    shop_space: {
        name: 'Espacio de Tienda',
        description: 'Amplía el área de exposición de productos',
        levels: [
            { price: 800, bonus: 2 },
            { price: 1500, bonus: 4 },
            { price: 3000, bonus: 6 }
        ]
    }
};

// Obtener la configuración de una mejora
export const getUpgradeConfig = (type) => {
    return UPGRADE_CONFIG[type];
};

// Obtener el precio de la siguiente mejora
export const getNextUpgradePrice = (type, currentLevel) => {
    const config = UPGRADE_CONFIG[type];
    if (!config || currentLevel >= config.levels.length) {
        return null;
    }
    return config.levels[currentLevel].price;
};

// Obtener el bonus total de una mejora
export const getUpgradeBonus = (type, level) => {
    const config = UPGRADE_CONFIG[type];
    if (!config || level === 0) {
        return 0;
    }
    return config.levels[level - 1].bonus;
};

// Obtener el espacio base y máximo según el tipo
export const getSpaceLimits = (type, level) => {
    const baseSpace = type === 'inventory_space' ? 3 : 3; // 3 slots base para ambos
    const bonus = getUpgradeBonus(type, level);
    return {
        base: baseSpace,
        total: baseSpace + bonus
    };
};

// Verificar si se puede comprar una mejora
export const canPurchaseUpgrade = (type, currentLevel, money) => {
    const nextPrice = getNextUpgradePrice(type, currentLevel);
    return nextPrice !== null && money >= nextPrice;
};

// Obtener los límites actuales de espacio para un juego
export const getCurrentSpaceLimits = async (gameId) => {
    try {
        // Obtener el estado del juego actual
        const GameState = (await import('../models/gameStateModel.js')).default;
        const gameState = await GameState.findById(gameId);

        if (!gameState) {
            return {
                inventory: { base: 3, total: 3 },
                shop: { base: 3, total: 3 }
            };
        }

        return {
            inventory: {
                base: 3,
                total: gameState.inventorySpace || 3
            },
            shop: {
                base: 3,
                total: 3 // Por ahora el espacio de la tienda es fijo
            }
        };
    } catch (error) {
        console.error('Error al obtener límites de espacio:', error);
        return {
            inventory: { base: 3, total: 3 },
            shop: { base: 3, total: 3 }
        };
    }
};

// Obtener el tiempo de venta reducido según el nivel de mejora
export const getReducedSaleTime = (baseTime, gameState) => {
    if (!gameState || !gameState.saleTimeReduction) {
        return baseTime;
    }

    const reduction = gameState.saleTimeReduction / 100; // Convertir porcentaje a decimal
    return Math.floor(baseTime * (1 - reduction));
}; 