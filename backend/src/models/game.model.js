import mongoose from 'mongoose';

const gameSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'El ID del usuario es requerido']
    },
    money: {
        type: Number,
        default: 1000 // Dinero inicial
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Game = mongoose.model('Game', gameSchema);

export default Game; 