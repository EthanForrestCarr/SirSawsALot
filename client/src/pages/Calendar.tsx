import React from 'react';
import CalendarPicker from '../components/CalendarPicker';
import BlockDateForm from '../components/forms/BlockDateForm';

const CalendarPage: React.FC = () => {
    return (
        <div>
            <h2>Manage Schedule</h2>
            <CalendarPicker selectedDate={null} setSelectedDate={() => {}} />
            <BlockDateForm />
        </div>
    );
};

export default CalendarPage;
