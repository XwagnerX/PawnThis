import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// Verificar si el modelo ya existe antes de crearlo
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido']
  },
  apellido: {
    type: String,
    required: [true, 'El apellido es requerido']
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
}));

// Método para encriptar la contraseña antes de guardar
User.schema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método para comparar contraseñas
User.schema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default User; 