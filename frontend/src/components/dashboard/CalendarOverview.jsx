import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

const CalendarOverview = ({ addEventToCalendar }) => {
  const [myEvents, setMyEvents] = useState([]);

  const handleAddEvent = (event) => {
    const start = new Date(event.start);
    const end = new Date(event.end);
    const eventToAdd = {
      id: myEvents.length, // Simple id generation, ideally use a more robust method
      title: event.title,
      start: start,
      end: end
    };
    setMyEvents([...myEvents, eventToAdd]);
  };

  return (
    <div className="h-full pt-5">
      <Calendar
        localizer={localizer}
        events={myEvents}
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, agenda: true }} // Exclude 'day' view
        defaultView={Views.MONTH}
        components={{ toolbar: CustomToolbar }} // Use the custom toolbar
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarOverview;
