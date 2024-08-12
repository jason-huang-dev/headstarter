import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SideBar, CalendarOverview, RightBar } from '../components/dashboard';
import { sideBarAccordians } from "../constants/index"; 
import { Accordion, AccordionItem } from '../components/reusable';
import { ContactRound, Handshake, Apple } from "lucide-react";

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
  const [isRightBarOpen, setIsRightBarOpen] = useState(false); 
  const [rightBarContent, setRightBarContent] = useState(''); 
  const [events, setEvents] = useState([]); 
  const [calendars, setCalendars] = useState([]); // New state for calendars

  const handleTitleClick = (index) => {
    setActiveIndices((prevIndices) => 
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index) 
        : [...prevIndices, index] 
    );
  };

  const addCalendar = (setIsOpen) => {
    setRightBarContent('calendar'); 
    setIsRightBarOpen(true); 
    setIsOpen(false);
  };
  
  const addEvent = (setIsOpen) => {
    setRightBarContent('event'); 
    setIsRightBarOpen(true); 
    setIsOpen(false); 
  };

  const handleAddEvent = (eventDetails) => {
    const newEvent = {
      id: events.length,
      title: eventDetails.title,
      start: new Date(eventDetails.start), 
      end: new Date(eventDetails.end) 
    };
    setEvents([...events, newEvent]); 
  };

  const handleAddCalendar = (calendarDetails) => {
    const newCalendar = {
      id: calendars.length,
      title: calendarDetails.name,
      icon: ContactRound, // or any icon you prefer
    };
    setCalendars([...calendars, newCalendar]); // Update calendars state
  };

  const exampleItems = [
    ...calendars, // Add the dynamically added calendars
    { id: 1, title: "Example Item 1", icon: ContactRound },
    { id: 2, title: "Example Item 2", icon: Handshake },
    { id: 3, title: "Example Item 3", icon: Apple },
  ];

  return (
    <div className="flex h-screen font-sora">
      {/* SideBar Component */}
      <SideBar user={user} addCalendar={addCalendar} addEvent={addEvent} isRightBarOpen={isRightBarOpen}>
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
                  {exampleItems.map((exampleItem) => (
                    <AccordionItem
                      key={exampleItem.id}
                      title={exampleItem.title}
                      IconComponent={exampleItem.icon} 
                      displayTitle={isOpen}
                      isActive={isOpen && activeIndices.includes(index)}
                      onTitleClick={() => handleTitleClick(index)}
                      link={`/dashboards/${exampleItem.id}`} 
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
        <CalendarOverview events={events} />  {/* Pass events to CalendarOverview */}
      </div>

      {/* Right Sidebar Component */}
      {isRightBarOpen && (
        <RightBar 
         isRightBarOpen={isRightBarOpen} 
         setIsRightBarOpen={setIsRightBarOpen} 
         content={rightBarContent} 
         addEventToCalendar={handleAddEvent}
         addCalendar={handleAddCalendar} // Pass the function to RightBar
       />
      )}
    </div>
  ); 
};

export default Dashboards;