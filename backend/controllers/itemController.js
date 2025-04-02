import Item from '../models/itemModel.js'; // Asegúrate de crear este modelo

// Obtener todos los objetos empeñados
export const getItems = async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Crear un nuevo objeto empeñado
export const createItem = async (req, res) => {
    const item = new Item(req.body);
    try {
        const savedItem = await item.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Actualizar un objeto empeñado
export const updateItem = async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedItem);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Eliminar un objeto empeñado
export const deleteItem = async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}; 