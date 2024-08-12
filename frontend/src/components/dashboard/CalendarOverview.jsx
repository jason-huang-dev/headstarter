import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

const CalendarOverview = ({ events }) => {
  return (
    <div className="h-full pt-5">
      <Calendar
        localizer={localizer}
        events={events} // Events passed as a prop
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, agenda: true }}
        defaultView={Views.MONTH}
        components={{ toolbar: CustomToolbar }}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarOverview;
