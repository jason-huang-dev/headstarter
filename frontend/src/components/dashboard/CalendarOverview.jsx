'use client'
import React, {useState} from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';
import { RightBar, Form, Button } from "../reusable";
import { eventForm, colorsForEvent } from "../../constants";

// Initialize the moment localizer
const localizer = momentLocalizer(moment);

/**
 * Returns a calendar view component
 * @param {Array[Object]} events
 * @returns A div containing the Calendar component
 */
const CalendarOverview = ({ events, calendars }) => {
  const [isRightBarOpen, setIsRightBarOpen] = useState(false); 
  const [rightBarContent, setRightBarContent] = useState(''); 
  const [eventDetails, setEventDetails] = useState({}); 
  
  const updateEventHandler = () => {
    setRightBarContent('update_event'); 
    setIsRightBarOpen(true); 
  };

  const submitUpdateEvent = (eventDetails) =>{
    updateEvent(eventDetails);
    setIsRightBarOpen(false);
  }

  // Event handler for when an event is selected
  const handleEventSelect = (event) => {
    console.log("Selected event:", event);
    setEventDetails(event);
    updateEventHandler()
  };

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
              <Button>Update Event</Button>
            </div>
          )}
        </Form>
      </RightBar>
    )}

    </div>
  );
};

export default CalendarOverview;
