import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    value: { type: Number, required: true },
    interestRate: { type: Number, required: true },
    status: { type: String, enum: ['empeñado', 'vendido'], default: 'empeñado' },
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);
export default Item; 