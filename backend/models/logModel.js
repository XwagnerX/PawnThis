import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    fecha: { type: Date, default: Date.now },
    tipo: { type: String, enum: ['error', 'info', 'warning'], required: true },
    accion: { type: String, required: true },
    usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    detalles: { type: Object },
    ip: { type: String }
});

const Log = mongoose.model('Log', logSchema);
export default Log; 