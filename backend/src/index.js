const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB'))
  .catch(err => console.error('Error conectando a MongoDB:', err));

// Importar rutas
const itemsRouter = require('./routes/items');
const gamesRouter = require('./routes/games');
const authRouter = require('./routes/auth');
const upgradeRouter = require('./routes/upgrade.routes');

// Rutas
app.use('/api/items', itemsRouter);
app.use('/api/games', gamesRouter);
app.use('/api/auth', authRouter);
app.use('/api/upgrades', upgradeRouter);

// Ruta de prueba
app.get('/test', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Algo salió mal!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
}); 