import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre del item es requerido']
    },
    condition: {
        type: String,
        required: [true, 'La condición del item es requerida']
    },
    requestedPrice: {
        type: Number,
        required: [true, 'El precio solicitado es requerido']
    },
    purchasePrice: {
        type: Number,
        required: [true, 'El precio de compra es requerido']
    },
    category: {
        type: String,
        required: [true, 'La categoría del item es requerida'],
        enum: ['relojes', 'joyeria', 'antiguedades', 'arte', 'coleccionables']
    },
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, 'El ID del juego es requerido']
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    salePrice: {
        type: Number,
        default: null
    },
    forSale: {
        type: Boolean,
        default: false
    },
    saleStartTime: {
        type: Date,
        default: null
    },
    imageUrl: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// Agregar índices para mejorar el rendimiento
itemSchema.index({ gameId: 1, userId: 1 });
itemSchema.index({ category: 1 });

const Item = mongoose.model('Item', itemSchema);
export default Item; 