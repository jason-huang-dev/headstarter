import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sideBarAccordians } from "../constants/index"; 
import { Accordion, AccordionItem } from '../components/reusable';
import { ContactRound, Handshake, Apple } from "lucide-react";
import { SideBar, CalendarOverview, RightBar } from '../components/dashboard';

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
    console.log(`Title clicked: ${index}`);
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

  const handleAddCalendar = async (calendarDetails) => {
    console.log('Adding Calendar:', calendarDetails)

    try {
      const response = await fetch('http://localhost:8000/api/calendars/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(calendarDetails),
      });

      const data = await response.json();
      console.log('Response from Add Calendar:', data)
      
      if (response.ok) {
        setCalendars([...calendars, data]); // Update calendars state
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    // Define the async function inside useEffect
    const fetchCalendars = async () => {
      console.log('Fetching calendars...');
      try {
        const response = await fetch('http://localhost:8000/api/calendars/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${user.token}`,
          },
        });
  
        const data = await response.json();
        console.log('Response from Get Calendars:', data);
  
        if (response.ok) {
          setCalendars(data); // Update calendars state
        } else {
          console.error('Error from server:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    fetchCalendars(); // Call the async function
    // Optionally, return a cleanup function here if needed
  }, [user.token]);

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
                  {calendars.map((calendar) => (
                    <AccordionItem
                      key={calendar.cal_id}
                      title={calendar.title}
                      IconComponent={calendar.icon} 
                      displayTitle={isOpen}
                      isActive={isOpen && activeIndices.includes(index)}
                      onTitleClick={() => handleTitleClick(index)}
                      link={`/dashboards/${calendar.id}`} 
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