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
        const inventoryUpgrade = await Upgrade.findOne({ gameId, type: 'inventory_space' });
        const shopUpgrade = await Upgrade.findOne({ gameId, type: 'shop_space' });

        return {
            inventory: getSpaceLimits('inventory_space', inventoryUpgrade?.level || 0),
            shop: getSpaceLimits('shop_space', shopUpgrade?.level || 0)
        };
    } catch (error) {
        console.error('Error al obtener límites de espacio:', error);
        return {
            inventory: { base: 3, total: 3 },
            shop: { base: 3, total: 3 }
        };
    }
}; 