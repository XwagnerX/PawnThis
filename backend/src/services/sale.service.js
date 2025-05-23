import { getReducedSaleTime } from './upgrade.service.js';

export const calculateSaleTime = async (item, gameState) => {
    // Tiempo base de venta (en segundos)
    let baseTime = 30; // 30 segundos por defecto

    // Ajustar el tiempo base según la rareza del item
    switch (item.rarity) {
        case 'common':
            baseTime = 30; // 30 segundos
            break;
        case 'uncommon':
            baseTime = 45; // 45 segundos
            break;
        case 'rare':
            baseTime = 60; // 60 segundos
            break;
        case 'epic':
            baseTime = 90; // 90 segundos
            break;
        case 'legendary':
            baseTime = 120; // 120 segundos
            break;
        default:
            baseTime = 30; // 30 segundos por defecto
    }

    // Aplicar la reducción de tiempo si existe la mejora
    return getReducedSaleTime(baseTime, gameState);
}; 