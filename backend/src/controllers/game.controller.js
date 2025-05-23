export const updateGameState = async (req, res) => {
    try {
        const { gameId } = req.params;
        const updates = req.body;
        
        // Validar que el juego existe y pertenece al usuario
        const game = await GameState.findById(gameId);
        if (!game) {
            return res.status(404).json({ message: 'Juego no encontrado' });
        }
        
        // Verificar que el usuario es el propietario del juego
        if (game.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'No autorizado' });
        }

        // Actualizar los campos permitidos
        const allowedUpdates = [
            'money', 
            'inventory', 
            'upgrades', 
            'inventorySpace', 
            'inventoryUpgrades',
            'fastSaleUpgrades',
            'saleTimeReduction'
        ];
        
        const updateData = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = updates[key];
            }
        });

        // Aplicar las actualizaciones
        const updatedGame = await GameState.findByIdAndUpdate(
            gameId,
            { $set: updateData },
            { new: true }
        );

        res.json(updatedGame);
    } catch (error) {
        console.error('Error al actualizar el estado del juego:', error);
        res.status(500).json({ message: 'Error al actualizar el estado del juego' });
    }
}; 