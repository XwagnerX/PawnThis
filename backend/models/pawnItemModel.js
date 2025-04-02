import mongoose from 'mongoose';

const pawnItemSchema = new mongoose.Schema({
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    valorEstimado: { type: Number, required: true },
    valorPrestado: { type: Number, required: true },
    tasaInteres: { type: Number, required: true },
    fechaEmpeno: { type: Date, default: Date.now },
    fechaVencimiento: { type: Date, required: true },
    estado: { type: String, enum: ['empeñado', 'redimido', 'vencido', 'vendido'], default: 'empeñado' },
    fotos: [{ type: String }],
    notas: { type: String },
    historialPagos: [{
        fecha: { type: Date, default: Date.now },
        monto: { type: Number, required: true },
        tipo: { type: String, enum: ['interés', 'capital', 'multa'], required: true }
    }]
});

const PawnItem = mongoose.model('PawnItem', pawnItemSchema);
export default PawnItem; 