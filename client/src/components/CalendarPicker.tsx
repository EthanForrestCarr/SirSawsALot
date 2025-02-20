import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer, SlotInfo } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

interface CalendarProps {
  selectedDate: Date | null;
  setSelectedDate: (date: Date) => void;
}

const CalendarPicker: React.FC<CalendarProps> = ({ selectedDate, setSelectedDate }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCalendarData = async () => {
      try {
        const approvedResponse = await axios.get('http://localhost:3000/approved-requests');
        const blockedResponse = await axios.get('http://localhost:3000/calendar/unavailable-dates'); // Updated endpoint

        console.log('Approved Requests:', approvedResponse.data);
        console.log('Blocked Dates:', blockedResponse.data);

        if (approvedResponse.data.length > 0) {
          const approvedEvents = approvedResponse.data.map((req: any) => ({
            id: req.id,
            title: `Job at ${req.address}`,
            start: new Date(req.date),
            end: new Date(req.date),
            allDay: true,
          }));

          setEvents(approvedEvents);
        } else {
          console.warn('No approved work requests found.');
        }

        if (blockedResponse.data.length > 0) {
          const blockedDays = blockedResponse.data.map((date: string) => new Date(date));
          setBlockedDates(blockedDays);
        } else {
          console.warn('No blocked dates found.');
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
        setLoading(false);
      }
    };

    fetchCalendarData();
  }, []);

  const handleDateClick = (slotInfo: SlotInfo) => {
    if (blockedDates.some((blocked) => blocked.toDateString() === slotInfo.start.toDateString())) {
      alert('This date is blocked. Please choose another.');
      return;
    }
    setSelectedDate(slotInfo.start);
  };

  return (
    <div>
      <h2>Pick a Date</h2>
      {loading && <p>Loading calendar data...</p>}
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500, margin: '20px' }}
        selectable
        onSelectSlot={handleDateClick}
        eventPropGetter={(event) => ({
          style: { backgroundColor: '#3f51b5', color: 'white' },
        })}
      />
      {selectedDate && <p>Selected Date: {format(selectedDate, 'yyyy-MM-dd')}</p>}
    </div>
  );
};

export default CalendarPicker;
