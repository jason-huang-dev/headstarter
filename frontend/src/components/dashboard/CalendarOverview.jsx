import React, {useState, useMemo} from "react";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import CustomToolbar from './CustomToolbar';
import { RightBar, Form, Button, Popup } from "../reusable";
import { eventForm, colorsForEvent } from "../../constants";
import { useUserContext } from "../../contexts/userDataHandler";

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
const CalendarOverview = ({events, isRightBarOpen, setIsRightBarOpen, rightBarContent, setRightBarContent, popupIsOpen }) => {
  const {calendars, updateEvent, deleteEvent} = useUserContext()
  const [eventDetails, setEventDetails] = useState({}); 
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  
  const expandedEvents = useMemo(() => {
    const allEvents = events.flatMap(event => {
      if (event.recurringDates && event.recurringDates.length > 0) {
        return [event, ...event.recurringDates];
      }
      return [event];
    });

    return allEvents.map(event => ({
      ...event,
      start: new Date(event.start),
      end: new Date(event.end)
    }));
  }, [events]);

  const editEventHandler = () => {
    setRightBarContent('update_event');
    setIsRightBarOpen(true);
  };

  const handleEventUpdate = (eventDetails) => {
    updateEvent(eventDetails);
    setIsRightBarOpen(false);
  };

  const handleEventSelect = (event) => {
    const formatDateForInput = (dateString) => {
      const date = new Date(dateString);
      return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    };
  
    let localStart, localEnd;
    if (event.isRecurring) {
      // For recurring events, use the original event time
      localStart = formatDateForInput(event.originalStart);
      localEnd = formatDateForInput(event.originalEnd);
    } else {
      localStart = formatDateForInput(event.start);
      localEnd = formatDateForInput(event.end);
    }
    
    const formattedEvent = {
      ...event,
      start: localStart,
      end: localEnd,
      repeat_until: event.repeat_until ? moment(event.repeat_until).format('YYYY-MM-DD') : null,
      originalStart: event.originalStart,
      originalEnd: event.originalEnd,
    };
    
    setEventDetails(formattedEvent);
    editEventHandler();
  };

  const handleEventDelete = (eventDetails) => {
    deleteEvent(eventDetails);
    setIsRightBarOpen(false);
  };
  
  const eventPropGetter = (event) => {
    const backgroundColor = event.bg_color || '#15803d';
    const style = {
      backgroundColor: backgroundColor,
      borderRadius: '5px',
      opacity: 0.8,
      color: 'white',
      border: '0px',
      display: 'block',
    };
    return { style };
  };

  return (
    <div 
      className={`h-full pt-5 max-h ${popupIsOpen ? 'pr-100' : isRightBarOpen ? 'pr-80' : ''}`}
      // added to try to contain the parent div to limit size of Calendar
      style={{
        maxWidth: '100%', // Set a maximum width for the container
        width: '1213px',      // Set the width to 100% of the parent container
        overflowX: 'hidden', // Prevent horizontal overflow
      }}
    >
      <Calendar
        localizer={localizer}
        events={expandedEvents}
        startAccessor="start"
        endAccessor="end"
        views={{ month: true, week: true, agenda: true }}
        defaultView={Views.MONTH}
        components={{ toolbar: CustomToolbar }}
        style={{ height: '100%'}}
        onSelectEvent={handleEventSelect}
        eventPropGetter={eventPropGetter}
      />

      {popupIsOpen  && rightBarContent === 'update_event' ? (
        <Popup 
          isOpen={isRightBarOpen} 
          onClose={() => setIsRightBarOpen(false)} 
          title="Edit Event"
        >
          <Form
            key={eventDetails.id || 'new'}
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
                <Button onClick={() => handleEventUpdate(formDetails)}>Update Event</Button>
                <Button 
                  className="text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                  onClick={() => handleEventDelete(formDetails)}
                >Delete</Button>
              </div>
            )}
          </Form>
        </Popup>
      ) : (
        isRightBarOpen && rightBarContent === 'update_event' && (
          <RightBar 
            isRightBarOpen={isRightBarOpen} 
            setIsRightBarOpen={setIsRightBarOpen} 
            rightBarTitle="Edit Event"
            className="fixed right-0 top-0 h-screen w-80"
          >
            <Form
              key={eventDetails.id || 'new'}
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
                  <Button onClick={() => handleEventUpdate(formDetails)}>Update Event</Button>
                  <Button 
                    className="text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    onClick={() => handleEventDelete(formDetails)}
                  >Delete</Button>
                </div>
              )}
            </Form>
          </RightBar>
        )
      )}
    </div>
  );
};

export default CalendarOverview;