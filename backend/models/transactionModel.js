import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    tipo: { type: String, enum: ['empeño', 'redencion', 'venta', 'pago'], required: true },
    fecha: { type: Date, default: Date.now },
    monto: { type: Number, required: true },
    clienteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
    empenoId: { type: mongoose.Schema.Types.ObjectId, ref: 'PawnItem' },
    metodoPago: { type: String, required: true },
    estado: { type: String, enum: ['completada', 'pendiente', 'cancelada'], default: 'pendiente' },
    notas: { type: String },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction; 