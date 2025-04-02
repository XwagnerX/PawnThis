import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    tasasInteres: {
        joyas: { type: Number, required: true },
        electronica: { type: Number, required: true },
        herramientas: { type: Number, required: true },
        otros: { type: Number, required: true }
    },
    plazosVencimiento: {
        joyas: { type: Number, required: true },
        electronica: { type: Number, required: true },
        herramientas: { type: Number, required: true },
        otros: { type: Number, required: true }
    },
    multasVencimiento: { type: Number, required: true },
    porcentajeVenta: { type: Number, required: true },
    configuracionMercado: {
        actualizacionAutomatica: { type: Boolean, required: true },
        intervaloActualizacion: { type: Number, required: true },
        variacionMaxima: { type: Number, required: true }
    }
});

const Setting = mongoose.model('Setting', settingSchema);
export default Setting; 