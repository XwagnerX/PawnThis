import { generateClient } from '../services/client.service.js';

// Generar un nuevo cliente con item
export const getNewClient = async (req, res) => {
    try {
        const client = await generateClient();
        if (!client) {
            return res.status(500).json({ message: 'Error al generar cliente' });
        }
        res.json(client);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Evaluar una oferta de compra
export const evaluateOffer = async (req, res) => {
    try {
        const { requestedPrice, offeredPrice, personality } = req.body;
        
        // Calcular la diferencia porcentual
        const difference = ((offeredPrice - requestedPrice) / requestedPrice) * 100;
        
        // Determinar la respuesta basada en la personalidad y la diferencia
        let response;
        let accepted = false;
        
        switch (personality) {
            case 'desesperado':
                accepted = difference >= -20; // Acepta si la oferta es al menos 80% del precio solicitado
                response = accepted ? 
                    "¡Gracias! Necesito el dinero urgentemente." : 
                    "Lo siento, pero necesito más dinero.";
                break;
                
            case 'negociador':
                accepted = difference >= -10; // Acepta si la oferta es al menos 90% del precio solicitado
                response = accepted ? 
                    "Es un trato justo. Acepto." : 
                    "Podríamos llegar a un mejor acuerdo.";
                break;
                
            case 'ambicioso':
                accepted = difference >= 0; // Solo acepta si la oferta es igual o mayor al precio solicitado
                response = accepted ? 
                    "¡Excelente! Sabía que valía más." : 
                    "¡Eso es una ofensa! Mi objeto vale mucho más.";
                break;
                
            case 'realista':
                accepted = difference >= -5; // Acepta si la oferta es al menos 95% del precio solicitado
                response = accepted ? 
                    "Es un precio justo de mercado." : 
                    "Creo que podemos hacerlo mejor.";
                break;
        }
        
        res.json({
            accepted,
            response,
            difference
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 