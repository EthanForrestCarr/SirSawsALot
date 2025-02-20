import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import axios from 'axios';

interface CalendarPickerProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, setSelectedDate }) => {
    const [unavailableDates, setUnavailableDates] = useState<Date[]>([]);

    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const response = await axios.get('http://localhost:3000/calendar/unavailable-dates');
                setUnavailableDates(response.data.map((dateStr: string) => new Date(dateStr)));
            } catch (error) {
                console.error('Error fetching unavailable dates:', error);
            }
        };
        fetchUnavailableDates();
    }, []);

    const isDateDisabled = (date: Date) => {
        return unavailableDates.some((unavailableDate) =>
            unavailableDate.toDateString() === date.toDateString()
        );
    };

    return (
        <div>
            <label>Select Date:</label>
            <Calendar
                onChange={(value) => setSelectedDate(Array.isArray(value) ? value[0] : value)}
                tileDisabled={({ date }) => isDateDisabled(date)} // Disable unavailable dates
            />
            {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
        </div>
    );
};

export default CalendarPicker;
