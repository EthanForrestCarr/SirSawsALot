import React, { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import { WorkRequestEvent } from '../interfaces/WorkRequestEvent';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DnDCalendar = withDragAndDrop<WorkRequestEvent>(Calendar);

const CalendarPicker: React.FC = () => {
  const [events, setEvents] = useState<WorkRequestEvent[]>([]);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Store admin status
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await api.get('/auth/me');
        setIsAdmin(response.data.is_admin); // Set the admin status
        console.log("🔍 Fetched User Role:", response.data.is_admin);
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
      }
    };

    const fetchCalendarData = async () => {
      try {
        const [requestsRes, blockedRes] = await Promise.all([
          api.get('/admin/all-requests'),
          api.get('/calendar/unavailable-dates'),
        ]);

        const workRequests = requestsRes.data.map((req: any) => ({
          id: req.id,
          title: `job`,
          start: new Date(req.date),
          end: new Date(req.date),
          status: req.status as 'pending' | 'approved' | 'denied',
          address: req.address,
          name: req.name,
          type: 'work-request',
        }));

        const blockedDates = blockedRes.data.map((date: string) => ({
          id: date,
          title: 'Blocked Date',
          start: new Date(date),
          end: new Date(date),
          type: 'blocked',
        }));

        setEvents([...workRequests, ...blockedDates]);
      } catch (error) {
        console.error('Error fetching calendar data:', error);
      }
    };

    fetchUserRole();
    fetchCalendarData();
  }, []);

  const eventStyleGetter = (event: WorkRequestEvent) => {
    let style = {};
    if (event.type === 'blocked') {
      style = { backgroundColor: '#FF5733', color: '#fff' };
    } else if (event.status === 'approved') {
      style = { backgroundColor: '#4CAF50', color: '#fff' };
    } else if (event.status === 'denied') {
      style = { backgroundColor: '#FF0000', color: '#fff' };
    }
    return { style };
  };

  const handleSelectEvent = async (event: WorkRequestEvent) => {
    console.log("✅ Event Clicked:", event);

    if (event.type === 'blocked' && isAdmin) {
      const confirmUnblock = window.confirm(`Do you want to unblock ${format(event.start, 'yyyy-MM-dd')}?`);
      if (!confirmUnblock) return;

      try {
        await api.delete(`/calendar/unblock-date/${format(event.start, 'yyyy-MM-dd')}`);

        setEvents((prevEvents) => prevEvents.filter((e) => e.id !== event.id));
        console.log(`✅ Successfully unblocked date: ${format(event.start, 'yyyy-MM-dd')}`);
      } catch (error) {
        console.error("❌ Error unblocking date:", error);
      }
    } else if (event.type === 'work-request') {
      navigate(`/admin/requests/${event.id}`); // Navigate to request details page
    }
  };

  const handleEventDrop = async ({ event, start }: EventInteractionArgs<WorkRequestEvent>) => {
    console.log(`🟡 handleEventDrop triggered for Request ID: ${event.id}, Moving to: ${format(start, 'yyyy-MM-dd')}`);

    try {
      const formattedDate = format(new Date(start), 'yyyy-MM-dd');

      const response = await api.patch(
        `/admin/requests/${event.id}`,
        { date: formattedDate },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log(`✅ Successfully updated request ${event.id} to ${formattedDate}`, response.data);

      setEvents((prevEvents) =>
        prevEvents.map((e) =>
          e.id === event.id ? { ...e, start: new Date(start), end: new Date(start) } : e
        )
      );
    } catch (error) {
      console.error("❌ Error updating work request date:", error);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <h2>Scheduled Work Requests</h2>
        <DnDCalendar
          localizer={localizer}
          events={events}
          startAccessor={(event) => event.start}
          endAccessor={(event) => event.end}
          style={{ height: 500, margin: '20px' }}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={handleSelectEvent}
          onEventDrop={handleEventDrop}
        />
      </div>
    </DndProvider>
  );
};

export default CalendarPicker;