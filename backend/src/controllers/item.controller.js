import Item from '../models/item.model.js';
import { getSteamItemPrice, getRandomizedPrice, getRandomPawnShopItem, getSteamItemImageUrl } from '../services/steamMarket.service.js';

// Obtener todos los items
export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
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
    console.log('Recibida petición de compra');
    console.log('Body:', req.body);
    console.log('Usuario:', req.user);
    
    try {
        const { gameId, itemName, condition, requestedPrice, purchasePrice, category } = req.body;

        if (!gameId) {
            console.error('No se proporcionó gameId');
            return res.status(400).json({ message: 'Se requiere gameId' });
        }

        if (!req.user || !req.user.id) {
            console.error('No se encontró información del usuario en el token');
            return res.status(401).json({ message: 'Usuario no autenticado' });
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
            imageUrl // Guardar la URL de la imagen
        });

        console.log('Intentando guardar item:', newItem);

        // Guardar el item
        const savedItem = await newItem.save();
        console.log('Item guardado exitosamente:', savedItem);
        res.status(201).json(savedItem);
    } catch (error) {
        console.error('Error detallado en la compra:', error);
        res.status(500).json({ 
            message: 'Error al procesar la compra',
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
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
    const userId = req.user.id;
    const item = await Item.findOne({ _id: itemId, userId });
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    // Validar que el precio no supere el 30% más que requestedPrice
    const maxPrice = Math.round(item.requestedPrice * 1.3);
    if (salePrice > maxPrice) {
      return res.status(400).json({ message: `El precio máximo permitido es $${maxPrice}` });
    }
    item.salePrice = salePrice;
    item.forSale = true;
    item.saleStartTime = new Date();
    await item.save();
    res.json({ message: 'Item puesto a la venta', item });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Completar la venta (después de 1 minuto)
export const completeSale = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.user.id;
    const item = await Item.findOne({ _id: itemId, userId });
    if (!item) return res.status(404).json({ message: 'Item no encontrado' });
    if (!item.forSale || !item.saleStartTime) {
      return res.status(400).json({ message: 'El item no está en venta' });
    }
    // Verificar que haya pasado al menos 1 minuto
    const now = new Date();
    const diff = now - item.saleStartTime;
    if (diff < 60000) {
      return res.status(400).json({ message: 'Aún no ha pasado 1 minuto desde que se puso a la venta' });
    }
    // Sumar el dinero al jugador (actualizar GameState)
    const GameState = (await import('../models/gameStateModel.js')).default;
    const gameState = await GameState.findOne({ _id: item.gameId, userId });
    if (gameState) {
      gameState.money += item.salePrice;
      await gameState.save();
    }
    // Eliminar el item
    await item.deleteOne();
    res.json({ message: 'Item vendido exitosamente', money: gameState ? gameState.money : undefined });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 