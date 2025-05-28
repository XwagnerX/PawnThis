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
            'saleTimeReduction',
            'saleBonus',
            'fameUpgrades'
        ];
        
        const updateData = {};
        Object.keys(updates).forEach(key => {
            if (allowedUpdates.includes(key)) {
                updateData[key] = updates[key];
            }
        });

        // Si se está actualizando el nivel de fama, asegurarse de que saleBonus también se actualice
        if (updateData.fameUpgrades !== undefined) {
            let saleBonus = 0;
            switch(updateData.fameUpgrades) {
                case 1:
                    saleBonus = 5;
                    break;
                case 2:
                    saleBonus = 10;
                    break;
                case 3:
                    saleBonus = 15;
                    break;
                default:
                    saleBonus = 0;
            }
            updateData.saleBonus = saleBonus;
        }

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

// Función para actualizar juegos existentes
export const updateExistingGames = async (req, res) => {
    try {
        // Actualizar todos los juegos que no tengan los campos saleBonus y fameUpgrades
        const result = await GameState.updateMany(
            { 
                $or: [
                    { saleBonus: { $exists: false } },
                    { fameUpgrades: { $exists: false } }
                ]
            },
            { 
                $set: { 
                    saleBonus: 0,
                    fameUpgrades: 0
                }
            }
        );

        res.json({ 
            message: 'Juegos actualizados exitosamente',
            modifiedCount: result.modifiedCount
        });
    } catch (error) {
        console.error('Error al actualizar juegos existentes:', error);
        res.status(500).json({ message: 'Error al actualizar juegos existentes' });
    }
}; 