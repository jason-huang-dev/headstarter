import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sideBarAccordians, calendarForm, eventForm } from "../constants"; 
import { Accordion, AccordionItem, RightBar, Form } from '../components/reusable';
import { SideBar, CalendarOverview, /*RightBar*/ } from '../components/dashboard';


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
  const [events, setEvents] = useState([]); 
  const [filteredEvents, setFilteredEvents] = useState(events);
  const [calendars, setCalendars] = useState([]); // New state for calendars

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

  const addCalendar = (setIsOpen) => {
    setRightBarContent('calendar'); 
    setIsRightBarOpen(true); 
    setIsOpen(false);
  };
  
  const addEvent = (setIsOpen) => {
    setRightBarContent('event'); 
    setIsRightBarOpen(true); 
    setIsOpen(false); 
    console.log(events)
  };

  const handleAddEvent = async (eventDetails) => {
    const dataToSend = {
      ...eventDetails, // Spread existing event details
    };    
    console.log('Adding Event:', dataToSend)

    try {
      const response = await fetch('http://localhost:8000/api/events/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();
      console.log('Response from Add Event:', data)
      
      if (response.ok) {
        setEvents([...events, data]); // Update events state
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
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

    const fetchEvents = async () => {
      console.log('Fetching events...');
      try {
        const response = await fetch('http://localhost:8000/api/events/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${user.token}`,
          },
        });
  
        const data = await response.json();
        console.log('Response from Get Events:', data);
  
        if (response.ok) {
          setEvents(data); // Update calendars state
          setFilteredEvents(data) // Update calendars state
        } else {
          console.error('Error from server:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
    
    fetchCalendars(); // Call the async function to get all calendars
    fetchEvents(); // Call the async function to get all events 
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

      {isRightBarOpen && (
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
          
          </Form>
        </RightBar>
      )}
    </div>
  ); 
};

export default Dashboards;