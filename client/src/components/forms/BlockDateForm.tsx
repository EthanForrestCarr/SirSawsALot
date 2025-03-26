import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DateInput from '../inputs/DateInput';
import BlockDateButton from '../buttons/BlockDateButton';
import '../../styles/Form.css';

const BlockDateForm: React.FC = () => {
    const [date, setDate] = useState('');
    const [message, setMessage] = useState('');
    const [blockedDates, setBlockedDates] = useState<string[]>([]);
    
    useEffect(() => {
        const fetchBlockedDates = async () => {
            try {
                const response = await axios.get('http://localhost:3000/calendar/unavailable-dates');
                setBlockedDates(response.data);
            } catch (error) {
                console.error('Error fetching blocked dates:', error);
            }
        };

        fetchBlockedDates();
    }, []);

    const handleBlockDate = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        try {
            const response = await axios.post('http://localhost:3000/calendar/block-date', { date }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage(response.data.message || 'Date blocked successfully!');
            setBlockedDates([...blockedDates, date]); // Update the UI immediately
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Error blocking date.');
        }
    };

    const handleUnblockDate = async (blockedDate: string) => {
        const token = localStorage.getItem('token');
        try {
            await axios.delete(`http://localhost:3000/calendar/unblock-date/${blockedDate}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            setBlockedDates(blockedDates.filter((d) => d !== blockedDate)); // Update UI
            console.log(`✅ Successfully unblocked ${blockedDate}`);
        } catch (error) {
            console.error('❌ Error unblocking date:', error);
        }
    };

    return (
        <div>
            <h3>Block Off a Date</h3>
            <form className="form" onSubmit={handleBlockDate}>
                <DateInput selectedDate={date} onDateChange={setDate} required />
                <BlockDateButton type="submit" />
            </form>
            {message && <p>{message}</p>}

            <h4>Blocked Dates</h4>
            <ul>
                {blockedDates.map((blockedDate) => (
                    <li key={blockedDate}>
                        {blockedDate} 
                        <button onClick={() => handleUnblockDate(blockedDate)}>Unblock</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlockDateForm;
