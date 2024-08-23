'use client'
import React, {useState} from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';
import { RightBar, Form, Button } from "../reusable";
import { eventForm, colorsForEvent } from "../../constants";
import userDataHandler from "./userDataHandler";

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

/**
 * Returns a calendar view component
 * @param {Array[Objects]} events - the events to be displayed/rendered
 * @param {boolean} isRightBarOpen - if the dashboard's right bar is open
 * @param {Function} setIsRightBarOpen - funtion to set the dashboard's right bar's open status
 * @param {String} rightBarContent - String stating what the rightbar should display
 * @param {Function} setRightBarContent - function to set the rightbar content string
 * @returns A div containing the Calendar component
 */
const CalendarOverview = ({events, isRightBarOpen, setIsRightBarOpen, rightBarContent, setRightBarContent }) => {
  const {calendars, updateEvent, deleteEvent} = userDataHandler()
  const [eventDetails, setEventDetails] = useState({}); 
  
  const editEventHandler = () => {
    setRightBarContent('update_event'); 
    setIsRightBarOpen(true); 
  };

  const handleEventUpdate = (eventDetails) =>{
    updateEvent(eventDetails);
    console.log("Event updated: ", eventDetails)
    setIsRightBarOpen(false);
  }

  // Event handler for when an event is selected
  const handleEventSelect = (event) => {
    console.log("Selected event:", event);
    setEventDetails(event);
    editEventHandler()
  };

  const handleEventDelete = (eventDetails) => {
    deleteEvent(eventDetails)
    console.log("Event deleted: ", eventDetails)
    setIsRightBarOpen(false);
  }

  return (
    <div className={`h-full pt-5 ${isRightBarOpen ? 'pr-80' : ''}`}>
      <Calendar
        localizer={localizer}
        events={events} // Events passed as a prop
        startAccessor={(event) => { return new Date(event.start) }}
        endAccessor={(event) => { return new Date(event.end) }}
        views={{ month: true, week: true, agenda: true }}
        defaultView={Views.MONTH}
        components={{ toolbar: CustomToolbar }}
        style={{height: '100%'}}
        onSelectEvent={handleEventSelect}
      />

    {isRightBarOpen && rightBarContent === 'update_event' && (
      <RightBar 
      isRightBarOpen={isRightBarOpen} 
      setIsRightBarOpen={setIsRightBarOpen} 
      rightBarTitle="Edit Event"
      className="fixed right-0 top-0 h-screen w-80"
      >
        <Form
          formFields={eventDetails}
          fields={eventForm(calendars)}
        >
          {({ formDetails, setFormDetails }) => (
            <div className="mb-2">
              {/* Color Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
                <div className="flex items-center space-x-2 mt-2">
                  {colorsForEvent.map((option, index) => (
                    <label key={index} className="flex items-center">
                      <input
                        type="radio"
                        name="color"
                        value={option.color}
                        checked={formDetails.color === option.color}
                        onChange={(e) => setFormDetails({ ...formDetails, color: e.target.value })}
                        className="hidden"
                      />
                      <span
                        className="w-6 h-6 rounded-full cursor-pointer"
                        style={{
                          backgroundColor: option.color,
                          border: formDetails.color === option.color ? '2px solid #94a3b8' : '2px solid transparent',
                        }}
                      ></span>
                    </label>
                  ))}
                </div>
              </div>
              <Button
                onClick={() => handleEventUpdate(formDetails)}
              >Update Event</Button>
              <Button 
                className="text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                onClick={() => handleEventDelete(formDetails)}
              >Delete</Button>
            </div>
          )}
        </Form>
      </RightBar>
    )}

    </div>
  );
};

export default CalendarOverview;
