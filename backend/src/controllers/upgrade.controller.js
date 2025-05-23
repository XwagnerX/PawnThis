import Upgrade from '../models/upgrade.model.js';
import Game from '../models/game.model.js';
import { getNextUpgradePrice, canPurchaseUpgrade, getUpgradeConfig } from '../services/upgrade.service.js';

// Obtener todas las mejoras de un juego
export const getGameUpgrades = async (req, res) => {
    try {
        const { gameId } = req.params;
        const upgrades = await Upgrade.find({ gameId });
        
        // Enriquecer la información de las mejoras
        const enrichedUpgrades = upgrades.map(upgrade => {
            const config = getUpgradeConfig(upgrade.type);
            const nextPrice = getNextUpgradePrice(upgrade.type, upgrade.level);
            
            return {
                ...upgrade.toObject(),
                name: config.name,
                description: config.description,
                nextPrice,
                maxLevel: config.levels.length
            };
        });

        res.json(enrichedUpgrades);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Comprar una mejora
export const purchaseUpgrade = async (req, res) => {
    try {
        const { gameId } = req.params;
        const { type } = req.body;

        // Obtener el juego y verificar el dinero
        const game = await Game.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }

        // Obtener o crear la mejora
        let upgrade = await Upgrade.findOne({ gameId, type });
        if (!upgrade) {
            upgrade = new Upgrade({ gameId, type, level: 0 });
        }

        // Verificar si se puede comprar la mejora
        if (!canPurchaseUpgrade(type, upgrade.level, game.money)) {
            return res.status(400).json({ 
                message: 'No tienes suficiente dinero para esta mejora' 
            });
        }

        // Obtener el precio de la siguiente mejora
        const price = getNextUpgradePrice(type, upgrade.level);

        // Actualizar el dinero del juego y el nivel de la mejora
        game.money -= price;
        upgrade.level += 1;

        // Guardar los cambios
        await Promise.all([game.save(), upgrade.save()]);

        res.json({
            upgrade: {
                ...upgrade.toObject(),
                name: getUpgradeConfig(type).name,
                description: getUpgradeConfig(type).description,
                nextPrice: getNextUpgradePrice(type, upgrade.level),
                maxLevel: getUpgradeConfig(type).levels.length
            },
            newMoney: game.money
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 