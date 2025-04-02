import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    dni: { type: String, required: true },
    telefono: { type: String, required: true },
    email: { type: String, required: true },
    direccion: { type: String, required: true },
    fechaRegistro: { type: Date, default: Date.now },
    historialEmpenos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PawnItem' }],
    historialCompras: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' }],
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
    limiteCredito: { type: Number, required: true },
    saldoActual: { type: Number, required: true },
});

const Client = mongoose.model('Client', clientSchema);
export default Client; 