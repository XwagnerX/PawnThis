import mongoose from 'mongoose';

const saleHistorySchema = new mongoose.Schema({
  gameId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Game',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  itemName: {
    type: String,
    required: true
  },
  originalPrice: {
    type: Number,
    required: true
  },
  finalPrice: {
    type: Number,
    required: true
  },
  bonusApplied: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// Índices para mejorar el rendimiento de las consultas
saleHistorySchema.index({ gameId: 1, date: -1 });
saleHistorySchema.index({ userId: 1, date: -1 });

const SaleHistory = mongoose.model('SaleHistory', saleHistorySchema);

export default SaleHistory; 