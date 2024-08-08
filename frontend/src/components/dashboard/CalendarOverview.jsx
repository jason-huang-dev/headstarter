import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';


// Initialize the moment localizer
const localizer = momentLocalizer(moment);

const CalendarOverview = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent({ ...newEvent, [name]: value });
  };

  const handleAddEvent = () => {
    const start = new Date(newEvent.start);
    const end = new Date(newEvent.end);
    const eventToAdd = {
      id: myEvents.length, // Simple id generation, ideally use a more robust method
      title: newEvent.title,
      start: start,
      end: end
    };
    setMyEvents([...myEvents, eventToAdd]);
    setNewEvent({ title: '', start: '', end: '' }); // Reset form
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
