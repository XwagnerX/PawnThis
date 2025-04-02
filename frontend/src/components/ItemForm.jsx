import React, { useState } from 'react';
import axios from 'axios';

const ItemForm = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [value, setValue] = useState('');
    const [interestRate, setInterestRate] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newItem = { name, description, value, interestRate };
        await axios.post('http://localhost:5000/api/items', newItem);
        // Resetear el formulario
        setName('');
        setDescription('');
        setValue('');
        setInterestRate('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
            <input type="text" placeholder="Descripción" value={description} onChange={(e) => setDescription(e.target.value)} required />
            <input type="number" placeholder="Valor" value={value} onChange={(e) => setValue(e.target.value)} required />
            <input type="number" placeholder="Tasa de Interés" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} required />
            <button type="submit">Agregar Objeto</button>
        </form>
    );
};

export default ItemForm; 