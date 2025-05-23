import mongoose from 'mongoose';

const gameStateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  money: {
    type: Number,
    default: 1000
  },
  inventory: [{
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item'
    },
    quantity: Number
  }],
  upgrades: [{
    type: {
      type: String,
      required: true
    },
    level: {
      type: Number,
      required: true
    }
  }],
  inventorySpace: {
    type: Number,
    default: 3
  },
  inventoryUpgrades: {
    type: Number,
    default: 0
  },
  fastSaleUpgrades: {
    type: Number,
    default: 0
  },
  saleTimeReduction: {
    type: Number,
    default: 0
  },
  lastPlayed: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

export default mongoose.model('GameState', gameStateSchema); 