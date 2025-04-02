import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true }, // Hasheada
    rol: { type: String, enum: ['admin', 'empleado', 'cajero'], required: true },
    estado: { type: String, enum: ['activo', 'inactivo'], default: 'activo' },
    fechaRegistro: { type: Date, default: Date.now },
    ultimoAcceso: { type: Date },
    permisos: [{ type: String }]
});

const User = mongoose.model('User', userSchema);
export default User; 