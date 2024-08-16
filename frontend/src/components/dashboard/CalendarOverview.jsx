import React from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

/**
 * Returns a calendar view component
 * @param {Array[Object]} events
 * @returns A div containing the Calendar component
 */
const CalendarOverview = ({ events }) => {
  return (
    <div className="h-full pt-5">
      <Calendar
        localizer={localizer}
        events={events} // Events passed as a prop
        startAccessor={(event) => { return new Date(event.start) }}
        endAccessor={(event) => { return new Date(event.end) }}
        views={{ month: true, week: true, agenda: true }}
        defaultView={Views.MONTH}
        components={{ toolbar: CustomToolbar }}
        style={{ height: '100%' }}
      />
    </div>
  );
};

export default CalendarOverview;
