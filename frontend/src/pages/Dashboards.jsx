import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sideBarAccordians, calendarForm, eventForm, colorsForEvent } from "../constants"; 
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
  const {calendars, shared_calendars,invitations ,events, filteredEvents, setFilteredEvents, addCalendar, addEvent} = userDataHandler();

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

  const accordions = sideBarAccordians(calendars, shared_calendars, invitations);

  return (
    <div className="flex h-screen font-sora">
      {/* SideBar Component */}
      <SideBar user={user} addCalendar={addCalendarHandler} addEvent={addEventHandler} isRightBarOpen={isRightBarOpen}>
        {({ isOpen, setIsOpen }) => (
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow">
              {accordions.map((item, index) => (
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
                  {item.contents.map((content, contentIndex) => (
                    <AccordionItem
                      key={content[item.content_key]}
                      title={content[item.content_title]}
                      displayTitle={isOpen}
                      isActive={isOpen && activeItems.includes(contentIndex)}
                      onTitleClick={() => handleItemClick(contentIndex)}
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
        <CalendarOverview events={filteredEvents} calendars={calendars}/>  {/* Pass events to CalendarOverview */}
      </div>
      
      {/* Content for adding a new calendar */}
      {isRightBarOpen && rightBarContent === 'calendar' && (
        <RightBar 
         isRightBarOpen={isRightBarOpen} 
         setIsRightBarOpen={setIsRightBarOpen} 
         rightBarTitle="Add Calendar"
         className="fixed right-0 top-0 h-screen w-80"
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
      
      {/* Content for adding a new event */}
      {isRightBarOpen && rightBarContent === 'event' && (
      <RightBar 
        isRightBarOpen={isRightBarOpen} 
        setIsRightBarOpen={setIsRightBarOpen} 
        rightBarTitle="Add Event"
        className="fixed right-0 top-0 h-screen w-80"
      >
        <Form
          formFields={{
            cal_id: calendars[0]?.cal_id || 'None',
            title: '',
            start: '',
            end: '',
            color: '#15803d', // Default color selection
          }}
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