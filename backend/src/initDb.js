import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/user.model.js';
import Item from './models/item.model.js';

dotenv.config();

const initializeDatabase = async () => {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conectado a MongoDB');

        // Crear usuario administrador
        const adminUser = new User({
            nombre: 'Admin',
            apellido: 'Sistema',
            email: 'admin@casa-empeños.com',
            password: 'admin123', // Se hasheará automáticamente
            rol: 'admin',
            estado: 'activo',
            permisos: ['all']
        });

        // Crear un item de prueba
        const testItem = new Item({
            nombre: 'Anillo de Oro',
            descripcion: 'Anillo de oro de 18 quilates',
            categoria: 'joyas',
            valorEstimado: 1000,
            valorPrestado: 500,
            tasaInteres: 5,
            fechaEmpeno: new Date(),
            fechaVencimiento: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 días
            estado: 'empeñado',
            fotos: ['https://ejemplo.com/foto.jpg'],
            notas: 'Item de prueba'
        });

        // Guardar los datos
        await adminUser.save();
        await testItem.save();

        console.log('Base de datos inicializada con éxito');
        process.exit(0);
    } catch (error) {
        console.error('Error al inicializar la base de datos:', error);
        process.exit(1);
    }
};

initializeDatabase(); 