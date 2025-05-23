import mongoose from 'mongoose';

const upgradeSchema = new mongoose.Schema({
    gameId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Game',
        required: [true, 'El ID del juego es requerido']
    },
    type: {
        type: String,
        required: [true, 'El tipo de mejora es requerido'],
        enum: ['inventory_space', 'shop_space']
    },
    level: {
        type: Number,
        default: 0,
        min: 0,
        max: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento
upgradeSchema.index({ gameId: 1, type: 1 }, { unique: true });

const Upgrade = mongoose.model('Upgrade', upgradeSchema);

export default Upgrade; 