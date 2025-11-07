import React, { useEffect, useState } from 'react';
import api from '../../utils/axiosConfig';

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
  const response = await api.get('/calendar/unavailable-dates');
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
    <div className="input-container">
      <label htmlFor="date" className="input-label">Select Date:</label>
      <input
        className="input-field"
        type="date"
        id="date"
        value={selectedDate}
        onChange={handleDateChange}
        min={new Date().toISOString().split('T')[0]}
      />
      {errorMessage && <p className="input-error">{errorMessage}</p>}
    </div>
  );
};

export default DateInput;
