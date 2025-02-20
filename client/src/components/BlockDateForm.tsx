import React, { useState } from 'react';
import axios from 'axios';

const BlockDateForm: React.FC = () => {
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:3000/calendar/block-date', { date }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message || 'Date blocked successfully!');
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Error blocking date.');
        }
    };

    return (
        <div>
            <h3>Block Off a Date</h3>
            <form onSubmit={handleSubmit}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
                <button type="submit">Block Date</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BlockDateForm;
