import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface DateInputProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  required?: boolean;
}

const DateInput: React.FC<DateInputProps> = ({ selectedDate, onDateChange }) => {
  const [blockedDates, setBlockedDates] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlockedDates = async () => {
      try {
        const response = await axios.get('http://localhost:3000/calendar/unavailable-dates');
        setBlockedDates(response.data.map((date: string) => new Date(date).toISOString().split('T')[0]));
      } catch (error) {
        console.error('Error fetching blocked dates:', error);
      }
    };

    fetchBlockedDates();
  }, []);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = event.target.value;

    if (blockedDates.includes(newDate)) {
      setErrorMessage('Date unavailable');
    } else {
      setErrorMessage(null);
      onDateChange(newDate);
    }
  };

  return (
    <div>
      <label htmlFor="date">Select Date:</label>
      <input
        type="date"
        id="date"
        value={selectedDate}
        onChange={handleDateChange}
        min={new Date().toISOString().split('T')[0]} // Prevent selecting past dates
      />
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
    </div>
  );
};

export default DateInput;
