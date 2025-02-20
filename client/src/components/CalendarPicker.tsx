import React from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarPickerProps {
    selectedDate: Date | null;
    setSelectedDate: (date: Date | null) => void;
}

const CalendarPicker: React.FC<CalendarPickerProps> = ({ selectedDate, setSelectedDate }) => {
    return (
        <div>
            <label>Select Date:</label>
            <Calendar onChange={(value) => setSelectedDate(Array.isArray(value) ? value[0] : value)} />
            {selectedDate && <p>Selected Date: {selectedDate.toDateString()}</p>}
        </div>
    );
};

export default CalendarPicker;
