import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sideBarAccordians, calendarForm, eventForm } from "../constants"; 
import { Accordion, AccordionItem, RightBar, Form, Button } from '../components/reusable';
import { SideBar, CalendarOverview, userDataHandler} from '../components/dashboard';
import { X } from 'lucide-react';


/**
 * Dashboards component that renders the dashboard with a SideBar.
 * 
 * This component uses `useLocation` from `react-router-dom` to access user data
 * from the state passed through the location object. It then renders the `SideBar`
 * component, passing the user data as a prop.
 * 
 * @component
 * @returns {JSX.Element} The rendered Dashboards component.
 * @workers Jason
 */

const Dashboards = () => {
  const location = useLocation();
  const user = location.state?.user;
  const [activeIndices, setActiveIndices] = useState([]); 
  const [activeItems, setActiveItems] = useState([]);
  const [isRightBarOpen, setIsRightBarOpen] = useState(false); 
  const [rightBarContent, setRightBarContent] = useState(''); 
  const {calendars, events, filteredEvents, setFilteredEvents, addCalendar, addEvent} = userDataHandler();

  const handleTitleClick = (index) => {
    console.log(`Title clicked: ${index}`);
    setActiveIndices((prevIndices) => 
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index) 
        : [...prevIndices, index] 
    );
  };

  const handleItemClick = (index) => {
    console.log(`Item clicked: ${index}`);
    
    setActiveItems((prevIndices) => {
      // Toggle the active item
      const updatedIndices = prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index)
        : [...prevIndices, index];
      
      // Filter events based on the updated active items
      const newFilteredEvents = events.filter(event =>
        updatedIndices.some(idx => event.cal_id === calendars[idx].cal_id)
      );
      
      setFilteredEvents(newFilteredEvents);
      return updatedIndices;
    });
  };

  const addCalendarHandler = (setIsOpen) => {
    setRightBarContent('calendar'); 
    setIsRightBarOpen(true); 
    setIsOpen(false);
  };
  
  const addEventHandler = (setIsOpen) => {
    setRightBarContent('event'); 
    setIsRightBarOpen(true); 
    setIsOpen(false); 
  };

  const submitAddCalendar = (calendarDetails) =>{
    addCalendar(calendarDetails);
    setIsRightBarOpen(false);
  }

  const submitAddEvent = (eventDetails) =>{
    addEvent(eventDetails);
    setIsRightBarOpen(false);
  }

  return (
    <div className="flex h-screen font-sora">
      {/* SideBar Component */}
      <SideBar user={user} addCalendar={addCalendarHandler} addEvent={addEventHandler} isRightBarOpen={isRightBarOpen}>
        {({ isOpen, setIsOpen }) => (
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow">
              {sideBarAccordians.map((item, index) => (
                <Accordion
                    key={index}
                    title={item.title}
                    displayTitle={isOpen} 
                    icon={item.iconUrl}
                    iconType={item.iconType}
                    isActive={isOpen && activeIndices.includes(index)} 
                    onTitleClick={() => {
                      if (window.innerWidth >= 1160 || !isRightBarOpen) {
                        if (!isOpen) setIsOpen(true); // open the sidebar if it's closed
                        handleTitleClick(index); // handle the accordion logic
                      }
                    }}
                  >
                  {calendars.map((calendar, calIndex) => (
                    <AccordionItem
                      key={calendar.cal_id}
                      title={calendar.title}
                      IconComponent={calendar.icon} 
                      displayTitle={isOpen}
                      isActive={isOpen && activeItems.includes(calIndex)}
                      onTitleClick={() => handleItemClick(calIndex)}
                      // link={`/dashboards/${calendar.cal_id}`} 
                    />
                  ))}
                </Accordion>
              ))}
            </div>
          </div>
        )} 
      </SideBar>

      {/* Main calendar view component */}
      <div className={`flex-grow h-full ${isRightBarOpen ? 'pr-80' : ''}`}>
        <CalendarOverview events={filteredEvents} />  {/* Pass events to CalendarOverview */}
      </div>

      {/* Right Sidebar Component */}
      {/* {isRightBarOpen && (
        <RightBar 
         isRightBarOpen={isRightBarOpen} 
         setIsRightBarOpen={setIsRightBarOpen} 
         content={rightBarContent} 
         addEventToCalendar={handleAddEvent}
         addCalendar={handleAddCalendar} // Pass the function to RightBar
         calendars={calendars}
       />
      )} */}
      
      {/* Content for adding a new calendar */}
      {isRightBarOpen && rightBarContent === 'calendar' && (
        <RightBar 
         isRightBarOpen={isRightBarOpen} 
         setIsRightBarOpen={setIsRightBarOpen} 
         rightBarTitle="Add Calendar"
        >
          <Form
            formFields={{
              title: '',
              addPeople: false,
              emails: '',
              email_list: [] // Maintain a list of emails
            }}
            fields={calendarForm}
          >
            {({ formDetails, setFormDetails }) => (
              <div className="mb-2">
                {/* Display each email with a delete button */}
                {formDetails.email_list.map((email, index) => (
                  <div
                    key={index}
                    className="text-sm px-2 py-1 rounded-lg bg-slate-200 text-gray-800 inline-flex items-center mr-2 mb-2"
                  >
                    {email}
                    <button 
                      onClick={() => setFormDetails({
                        ...formDetails,
                        email_list: formDetails.email_list.filter((_, i) => i !== index) // Remove email by filtering out the one at the specified index
                      })}
                      className="ml-2 text-gray-600 hover:text-gray-900"
                    >
                      <X size={14} /> {/* Small X icon for deleting the email */}
                    </button>
                  </div>
                ))}
                <Button onClick={() => submitAddCalendar(formDetails)}>Add Calendar</Button>
              </div>
            )}
          </Form>
        </RightBar>
      )}

      {isRightBarOpen && rightBarContent === 'event' && (
        <RightBar 
         isRightBarOpen={isRightBarOpen} 
         setIsRightBarOpen={setIsRightBarOpen} 
         rightBarTitle="Add Event"
        >
          <Form
            formFields={{
              cal_id: calendars[0].cal_id || NOne,
              title: '',
              start: '',
              end: '',
              color: '#15803d', // Default color selection
            }}
            fields={eventForm(calendars)}
          >
            {({ formDetails, setFormDetails }) => (
              <div className="mb-2">
                <Button onClick={() => submitAddEvent(formDetails)}>Add Event</Button>
              </div>
            )}
          </Form>
        </RightBar>
      )}
    </div>
  ); 
};

export default Dashboards;