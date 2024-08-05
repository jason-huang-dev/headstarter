import React, { useState } from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./CalendarOverview.css"; // Import the custom CSS file
import CustomToolbar from './CustomToolbar';

// Sample events data
const events = [
  {
    id: 0,
    title: 'Board meeting',
    start: new Date(2023, 7, 7, 9, 0, 0),
    end: new Date(2023, 7, 7, 13, 0, 0),
  },
  {
    id: 1,
    title: 'Birthday Party',
    start: new Date(2023, 7, 13, 7, 0, 0),
    end: new Date(2023, 7, 13, 10, 30, 0),
  },
  // Add more events here
];

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

const CalendarOverview = () => {
  const [myEvents, setMyEvents] = useState(events);

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
