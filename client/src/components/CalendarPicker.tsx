import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, dateFnsLocalizer, Event as RBCEvent } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import withDragAndDrop, { EventInteractionArgs } from 'react-big-calendar/lib/addons/dragAndDrop';
import RequestDetailsModal from './modals/RequestDetailsModal';
import { WorkRequestEvent } from '../interfaces/WorkRequestEvent';

const locales = { 'en-US': enUS };
const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });

const DnDCalendar = withDragAndDrop<WorkRequestEvent>(Calendar);

const CalendarPicker: React.FC = () => {
  const [events, setEvents] = useState<WorkRequestEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<WorkRequestEvent | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Store admin status

  useEffect(() => {
    const fetchUserRole = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const response = await axios.get('http://localhost:3000/auth/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setIsAdmin(response.data.is_admin); // Set the admin status
        console.log("🔍 Fetched User Role:", response.data.is_admin);
      } catch (error) {
        console.error("❌ Error fetching user role:", error);
      }
    };

    const fetchCalendarData = async () => {
      const token = localStorage.getItem('token');
      try {
        const [requestsRes, blockedRes] = await Promise.all([
          axios.get('http://localhost:3000/admin/all-requests', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:3000/calendar/unavailable-dates'),
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

  const handleSelectEvent = (event: WorkRequestEvent) => {
    console.log("✅ Event Clicked:", event);
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleEventDrop = async ({ event, start }: EventInteractionArgs<WorkRequestEvent>) => {
    console.log(`🟡 handleEventDrop triggered for Request ID: ${event.id}, Moving to: ${format(start, 'yyyy-MM-dd')}`);

    try {
      const formattedDate = format(new Date(start), 'yyyy-MM-dd');

      const response = await axios.patch(
        `http://localhost:3000/admin/requests/${event.id}`,
        { date: formattedDate },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' } }
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

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
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

        {showModal && selectedEvent && (
          <RequestDetailsModal event={selectedEvent} onClose={handleCloseModal} />
        )}
      </div>
    </DndProvider>
  );
};

export default CalendarPicker;