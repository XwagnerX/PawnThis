import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
    empenoId: { type: mongoose.Schema.Types.ObjectId, ref: 'PawnItem', required: true },
    nombre: { type: String, required: true },
    descripcion: { type: String, required: true },
    categoria: { type: String, required: true },
    precioVenta: { type: Number, required: true },
    estado: { type: String, enum: ['disponible', 'reservado', 'vendido'], default: 'disponible' },
    fechaIngreso: { type: Date, default: Date.now },
    fechaVenta: { type: Date },
    ubicacion: { type: String },
    fotos: [{ type: String }],
    notas: { type: String },
});

const Inventory = mongoose.model('Inventory', inventorySchema);
export default Inventory; 