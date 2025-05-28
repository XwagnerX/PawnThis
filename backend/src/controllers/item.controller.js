import Item from '../models/item.model.js';
import { getSteamItemPrice, getRandomizedPrice, getRandomPawnShopItem, getSteamItemImageUrl } from '../services/steamMarket.service.js';
import { getCurrentSpaceLimits } from '../services/upgrade.service.js';
import { calculateSaleTime } from '../services/sale.service.js';
import SaleHistory from '../models/saleHistory.model.js';

// Obtener todos los items
export const getItems = async (req, res) => {
    try {
        const { gameId } = req.params;
        const items = await Item.find({ gameId });
        
        // Obtener los límites de espacio actuales
        const spaceLimits = await getCurrentSpaceLimits(gameId);
        
        // Contar items en inventario y en venta
        const inventoryCount = items.filter(item => !item.forSale).length;
        const shopCount = items.filter(item => item.forSale).length;

        res.json({
            items,
            limits: {
                inventory: {
                    current: inventoryCount,
                    max: spaceLimits.inventory.total
                },
                shop: {
                    current: shopCount,
                    max: spaceLimits.shop.total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener item por ID
export const getItemById = async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear nuevo item
export const createItem = async (req, res) => {
    try {
        const { gameId, userId } = req.body;
        
        // Obtener un item aleatorio de la casa de empeños
        const randomItem = await getRandomPawnShopItem();
        
        // Calcular el precio de compra (70% del precio solicitado)
        const purchasePrice = Math.round(randomItem.requestedPrice * 0.7);

        const item = new Item({
            name: randomItem.name,
            condition: randomItem.condition,
            requestedPrice: randomItem.requestedPrice,
            purchasePrice,
            gameId,
            userId,
            category: randomItem.category
        });

        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar item
export const updateItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }
        res.json(item);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar item
export const deleteItem = async (req, res) => {
    try {
        const item = await Item.findByIdAndDelete(req.params.id);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }
        res.json({ message: 'Item eliminado exitosamente' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Comprar un item
export const purchaseItem = async (req, res) => {
    try {
        const { gameId, itemName, condition, requestedPrice, purchasePrice, category } = req.body;

        // Obtener los límites de espacio actuales
        const spaceLimits = await getCurrentSpaceLimits(gameId);
        
        // Contar items actuales en inventario
        const inventoryCount = await Item.countDocuments({ 
            gameId, 
            forSale: false 
        });

        // Verificar si hay espacio en el inventario
        if (inventoryCount >= spaceLimits.inventory.total) {
            return res.status(400).json({ 
                message: 'No tienes espacio suficiente en el inventario. Considera comprar una mejora.' 
            });
        }

        // Obtener la imagen del item
        const imageUrl = await getSteamItemImageUrl(itemName);

        // Crear el nuevo item
        const newItem = new Item({
            name: itemName,
            condition,
            requestedPrice,
            purchasePrice,
            category,
            gameId,
            userId: req.user.id,
            imageUrl
        });

        // Guardar el item
        const savedItem = await newItem.save();
        
        // Obtener el nuevo conteo de items
        const newInventoryCount = await Item.countDocuments({ 
            gameId, 
            forSale: false 
        });

        res.status(201).json({
            item: savedItem,
            limits: {
                inventory: {
                    current: newInventoryCount,
                    max: spaceLimits.inventory.total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener items por gameId y userId
export const getItemsByGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;
    const items = await Item.find({ gameId, userId });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Poner un item a la venta
export const putItemForSale = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { salePrice } = req.body;

        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({ message: 'Item no encontrado' });
        }

        // Obtener los límites de espacio actuales
        const spaceLimits = await getCurrentSpaceLimits(item.gameId);
        
        // Contar items actuales en venta
        const shopCount = await Item.countDocuments({ 
            gameId: item.gameId, 
            forSale: true 
        });

        // Verificar si hay espacio en la tienda
        if (shopCount >= spaceLimits.shop.total) {
            return res.status(400).json({ 
                message: 'No tienes espacio suficiente en la tienda. Considera comprar una mejora.' 
            });
        }

        item.forSale = true;
        item.salePrice = salePrice;
        item.saleStartTime = new Date();
        
        const updatedItem = await item.save();
        
        // Obtener el nuevo conteo de items
        const newShopCount = await Item.countDocuments({ 
            gameId: item.gameId, 
            forSale: true 
        });

        res.json({
            item: updatedItem,
            limits: {
                shop: {
                    current: newShopCount,
                    max: spaceLimits.shop.total
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Completar la venta (después del tiempo calculado)
export const completeSale = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    if (!item.forSale || !item.saleStartTime) {
      return res.status(400).json({ message: 'El item no está en venta' });
    }

    // Obtener el estado del juego para calcular el tiempo de venta
    const GameState = (await import('../models/gameStateModel.js')).default;
    const gameState = await GameState.findOne({ _id: item.gameId, userId });
    if (!gameState) {
      return res.status(404).json({ message: 'Estado del juego no encontrado' });
    }

    // Calcular el tiempo de venta
    const saleTime = await calculateSaleTime(item, gameState);
    const now = new Date();
    const diff = now - item.saleStartTime;
    if (diff < saleTime * 1000) {
      return res.status(400).json({ 
        message: `Aún no ha pasado el tiempo necesario (${saleTime}s) desde que se puso a la venta` 
      });
    }

    // Calcular el precio final con el bonus de fama
    let finalPrice = item.salePrice;
    console.log('Estado del juego:', {
      gameId: gameState._id,
      saleBonus: gameState.saleBonus,
      fameUpgrades: gameState.fameUpgrades,
      upgrades: gameState.upgrades
    });
    
    const bonusApplied = gameState.saleBonus ? `${gameState.saleBonus}%` : '0%';
    if (gameState.saleBonus) {
      const bonusMultiplier = 1 + (gameState.saleBonus / 100);
      finalPrice = Math.round(item.salePrice * bonusMultiplier);
      console.log('Cálculo del bonus:', {
        originalPrice: item.salePrice,
        bonusPercentage: gameState.saleBonus,
        bonusMultiplier,
        finalPrice
      });
    }

    // Guardar en el historial de ventas
    const saleHistory = new SaleHistory({
      gameId: item.gameId,
      userId: userId,
      itemName: item.name,
      originalPrice: item.salePrice,
      finalPrice: finalPrice,
      bonusApplied: bonusApplied
    });
    await saleHistory.save();

    // Sumar el dinero al jugador
    gameState.money += finalPrice;
    await gameState.save();

    // Eliminar el item
    await item.deleteOne();
    res.json({ 
      message: 'Item vendido exitosamente', 
      money: gameState.money,
      originalPrice: item.salePrice,
      bonusApplied: bonusApplied,
      finalPrice: finalPrice
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener historial de ventas
export const getSalesHistory = async (req, res) => {
  try {
    const { gameId } = req.params;
    const userId = req.user.id;

    // Verificar que el juego pertenece al usuario
    const GameState = (await import('../models/gameStateModel.js')).default;
    const gameState = await GameState.findOne({ _id: gameId, userId });
    if (!gameState) {
      return res.status(404).json({ message: 'Juego no encontrado' });
    }

    // Obtener el historial de ventas
    const sales = await SaleHistory.find({ gameId })
      .sort({ date: -1 })
      .limit(50);

    // Calcular el total ganado por bonus de fama
    const totalBonus = sales.reduce((total, sale) => {
      if (sale.bonusApplied !== '0%') {
        return total + (sale.finalPrice - sale.originalPrice);
      }
      return total;
    }, 0);

    res.json({
      sales,
      totalBonus
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 