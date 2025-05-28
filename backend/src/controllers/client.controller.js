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
        
        // --- Lógica de Negociación Mejorada ---

        // 0. Aceptación inmediata si la oferta coincide con el precio solicitado
        if (offeredPrice === requestedPrice) {
             return res.json({
                accepted: true,
                response: "¡Exactamente lo que pedía! Trato hecho.",
                difference: 0, // La diferencia es 0%
                negotiating: false, // No hay necesidad de negociar
                final: true // Respuesta final
            });
        }

        // 1. Rechazo inmediato por oferta muy baja
        if (offeredPrice < requestedPrice * 0.5) { // Si la oferta es menos del 50% del precio solicitado
            return res.json({
                accepted: false,
                response: "¡Eso es un insulto! No voy a malgastar mi tiempo.",
                difference,
                negotiating: false, // No hay negociación posible
                final: true // Respuesta final
            });
        }

        // Calcular la diferencia porcentual para la lógica restante
        const difference = ((offeredPrice - requestedPrice) / requestedPrice) * 100;

        // 2. Lógica basada en personalidad y diferencia para respuestas no inmediatas
        let responseText;
        let accepted = false;
        let negotiating = true;
        let final = false;
        
        switch (personality) {
            case 'desesperado':
                if (difference >= -15) { // Oferta al menos 85% del solicitado
                    accepted = true;
                    responseText = "¡Gracias! Necesito el dinero urgentemente.";
                    final = true; // Acepta la oferta
                } else if (difference >= -30) { // Oferta entre 70% y 85% (ajustar umbral)
                    responseText = "Necesito un poco más, pero podemos hablar.";
                    negotiating = true;
                } else { // Oferta entre 50% y 70%
                    responseText = "Es muy poco, no sé si me sirve...";
                    negotiating = true;
                }
                break;
                
            case 'negociador':
                if (difference >= -5) { // Oferta al menos 95% del solicitado (ajustar umbral)
                    accepted = true;
                    responseText = "Es un trato justo. Acepto.";
                    final = true;
                } else if (difference >= -15) { // Oferta entre 85% y 95%
                    responseText = "Podríamos llegar a un mejor acuerdo. ¿Puedes subir un poco?";
                    negotiating = true;
                } else { // Oferta entre 50% y 85%
                     responseText = "No es lo que esperaba, ¿estás dispuesto a negociar?";
                     negotiating = true;
                }
                break;
                
            case 'ambicioso':
                if (difference >= 5) { // Oferta al menos 105% del solicitado
                    accepted = true;
                    responseText = "¡Excelente! Sabía que valía más.";
                    final = true;
                } else if (difference >= 0) { // Oferta entre 100% y 105% (ajustar umbral)
                    responseText = "Hmm, es justo el precio solicitado... ¿no puedes dar un poco más?";
                    negotiating = true;
                } else if (difference >= -10) { // Oferta entre 90% y 100%
                     responseText = "Eso es algo bajo. Mi objeto vale más, pero quizás podamos negociar.";
                     negotiating = true;
                } else { // Oferta entre 50% y 90%
                    responseText = "¡Eso es una ofensa! No me interesa a ese precio.";
                    final = true; // Rechazo final
                    accepted = false;
                    negotiating = false;
                }
                break;
                
            case 'realista':
                if (difference >= 0) { // Oferta al menos 100% del solicitado (ajustar umbral)
                     accepted = true;
                     responseText = "Es un precio justo de mercado. Acepto.";
                     final = true;
                } else if (difference >= -10) { // Oferta entre 90% y 100%
                     responseText = "Creo que podemos hacerlo mejor. ¿Qué tal si ajustas un poco tu oferta?";
                     negotiating = true;
                } else { // Oferta entre 50% y 90%
                    responseText = "Está un poco por debajo de lo que esperaba, pero podemos negociar.";
                    negotiating = true;
                }
                break;
        }
        
        res.json({
            accepted,
            response: responseText,
            difference,
            negotiating, // Indica si el cliente está dispuesto a seguir negociando
            final // Indica si es una respuesta final (aceptación o rechazo)
        });
    } catch (error) {
        console.error('Error al evaluar oferta:', error);
        res.status(500).json({ message: error.message });
    }
}; 