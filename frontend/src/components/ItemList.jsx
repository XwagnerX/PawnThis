import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ItemList = () => {
    const [items, setItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            const response = await axios.get('http://localhost:5000/api/items');
            setItems(response.data);
        };
        fetchItems();
    }, []);

    return (
        <div>
            <h2>Objetos Empeñados</h2>
            <ul>
                {items.map(item => (
                    <li key={item._id}>{item.name} - ${item.value}</li>
                ))}
            </ul>
        </div>
    );
};

export default ItemList; 