import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

// Función para registrar un usuario de prueba
const registerUser = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, {
            nombre: 'Test',
            apellido: 'User',
            email: 'test@test.com',
            password: 'test123'
        });
        console.log('Usuario registrado:', response.data);
    } catch (error) {
        console.error('Error al registrar:', error.response?.data);
    }
};

// Función para iniciar sesión
const login = async () => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, {
            email: 'test@test.com',
            password: 'test123'
        });
        return response.data.token;
    } catch (error) {
        console.error('Error al iniciar sesión:', error.response?.data);
        return null;
    }
};

// Función para obtener un nuevo cliente
const getNewClient = async (token) => {
    try {
        const response = await axios.get(`${API_URL}/clients/new`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al obtener cliente:', error.response?.data);
        return null;
    }
};

// Función para evaluar una oferta
const evaluateOffer = async (token, data) => {
    try {
        const response = await axios.post(`${API_URL}/clients/evaluate-offer`, data, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        console.error('Error al evaluar oferta:', error.response?.data);
        return null;
    }
};

// Función principal de prueba
const runTest = async () => {
    // 1. Registrar usuario
    await registerUser();
    
    // 2. Iniciar sesión
    const token = await login();
    if (!token) {
        console.error('No se pudo obtener el token');
        return;
    }
    
    // 3. Obtener un nuevo cliente
    const client = await getNewClient(token);
    if (!client) {
        console.error('No se pudo obtener el cliente');
        return;
    }
    
    console.log('\nCliente generado:');
    console.log('Nombre:', client.name);
    console.log('Personalidad:', client.personality);
    console.log('Descripción:', client.personalityDescription);
    console.log('\nItem:');
    console.log('Nombre:', client.item.name);
    console.log('Categoría:', client.item.category);
    console.log('Condición:', client.item.condition);
    console.log('Precio solicitado:', client.item.requestedPrice);
    
    // 4. Probar diferentes ofertas
    const testOffers = [
        client.item.requestedPrice * 0.7,  // 70% del precio solicitado
        client.item.requestedPrice * 0.9,  // 90% del precio solicitado
        client.item.requestedPrice,        // Precio solicitado
        client.item.requestedPrice * 1.2   // 20% más del precio solicitado
    ];
    
    console.log('\nProbando diferentes ofertas:');
    for (const offer of testOffers) {
        const evaluation = await evaluateOffer(token, {
            requestedPrice: client.item.requestedPrice,
            offeredPrice: Math.round(offer),
            personality: client.personality
        });
        
        if (evaluation) {
            console.log(`\nOferta de ${Math.round(offer)}:`);
            console.log('Respuesta:', evaluation.response);
            console.log('¿Aceptada?:', evaluation.accepted);
            console.log('Diferencia porcentual:', evaluation.difference.toFixed(2) + '%');
        }
    }
};

// Ejecutar la prueba
runTest(); 