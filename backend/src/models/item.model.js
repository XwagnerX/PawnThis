import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true,
        enum: ['joyas', 'electronica', 'herramientas', 'otros']
    },
    valorEstimado: {
        type: Number,
        required: true
    },
    valorPrestado: {
        type: Number,
        required: true
    },
    tasaInteres: {
        type: Number,
        required: true
    },
    fechaEmpeno: {
        type: Date,
        default: Date.now
    },
    fechaVencimiento: {
        type: Date,
        required: true
    },
    estado: {
        type: String,
        enum: ['empeñado', 'redimido', 'vencido', 'vendido'],
        default: 'empeñado'
    },
    fotos: [{
        type: String
    }],
    notas: {
        type: String
    },
    historialPagos: [{
        fecha: {
            type: Date,
            default: Date.now
        },
        monto: {
            type: Number,
            required: true
        },
        tipo: {
            type: String,
            enum: ['interés', 'capital', 'multa'],
            required: true
        }
    }]
}, {
    timestamps: true
});

const Item = mongoose.model('Item', itemSchema);
export default Item; 