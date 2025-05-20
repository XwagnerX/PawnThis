const express = require('express');
const router = express.Router();
const Item = require('../models/Item');
const Game = require('../models/Game');
const auth = require('../middleware/auth');

// Ruta de prueba
router.get('/test', (req, res) => {
  res.json({ message: 'Ruta de items funcionando' });
});

// Comprar un item (temporalmente sin auth para pruebas)
router.post('/purchase', async (req, res) => {
  console.log('Recibida petición de compra');
  console.log('Body:', req.body);
  
  try {
    const { gameId, itemName, condition, requestedPrice, purchasePrice } = req.body;

    if (!gameId) {
      return res.status(400).json({ message: 'Se requiere gameId' });
    }

    // Crear el nuevo item
    const newItem = new Item({
      name: itemName,
      condition,
      requestedPrice,
      purchasePrice,
      gameId,
      userId: '65f1a2b3c4d5e6f7g8h9i0j1' // ID temporal para pruebas
    });

    // Guardar el item
    const savedItem = await newItem.save();
    console.log('Item guardado:', savedItem);
    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error en la compra:', error);
    res.status(500).json({ message: error.message });
  }
});

// Obtener todos los items de un usuario en una partida específica
router.get('/game/:gameId', auth, async (req, res) => {
  try {
    const items = await Item.find({
      userId: req.user._id,
      gameId: req.params.gameId
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Vender un item
router.delete('/:itemId', auth, async (req, res) => {
  try {
    const item = await Item.findOne({
      _id: req.params.itemId,
      userId: req.user._id
    });

    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    // Actualizar el dinero del usuario
    const game = await Game.findOne({ _id: item.gameId, userId: req.user._id });
    if (game) {
      game.money += item.purchasePrice;
      await game.save();
    }

    // Eliminar el item
    await item.remove();
    res.json({ message: 'Item vendido exitosamente' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 