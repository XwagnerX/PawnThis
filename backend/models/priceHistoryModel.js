import mongoose from 'mongoose';

const priceHistorySchema = new mongoose.Schema({
    categoria: { type: String, required: true },
    fecha: { type: Date, default: Date.now },
    precioBase: { type: Number, required: true },
    variacion: { type: Number, required: true },
    precioFinal: { type: Number, required: true },
    factores: {
        demanda: { type: Number, required: true },
        oferta: { type: Number, required: true },
        temporada: { type: String, required: true }
    }
});

const PriceHistory = mongoose.model('PriceHistory', priceHistorySchema);
export default PriceHistory; 