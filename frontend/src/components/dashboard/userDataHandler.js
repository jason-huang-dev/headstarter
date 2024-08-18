import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const userDataHandler = () => {
    const location = useLocation();
    const user = location.state?.user;
    const [calendars, setCalendars] = useState([]);
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [invitations, setInvitations] = useState([]);
    const [shared_calendars, setSharedCalendars] = useState([]);


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

        const fetchInvitations = async () => {
          console.log('Fetching invitations...');
          try {
            const response = await fetch('http://localhost:8000/api/invitations/', {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${user.token}`,
              },
            });
      
            const data = await response.json();
            console.log('Response from Get Invitations:', data);
      
            if (response.ok) {
              setInvitations(data); // Update invitations state
            } else {
              console.error('Error from server:', data);
            }
          } catch (error) {
            console.error('Error:', error);
          }
        };

        fetchCalendars(); // Call the async function to get all calendars
        fetchEvents(); // Call the async function to get all events 
        fetchInvitations(); // Call the async function to get all invitations
    }, [user.token]);
    
    const addEvent = async (eventDetails) => {
      if (!eventDetails.title.trim()) {
        alert("Calendar name is required!"); // Show an alert if the calendar name is missing
        return;
      }
      console.log('Adding Event:', eventDetails)
  
      try {
        const response = await fetch('http://localhost:8000/api/events/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${user.token}`,
          },
          body: JSON.stringify(eventDetails),
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

    const addCalendar = async (calendarDetails) => {
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
          // setCalendars([...calendars, data]); // Update calendars state
          setCalendars([...calendars, data.calendar]);
        } else {
          console.error('Error from server:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    return { calendars, shared_calendars,invitations,events, filteredEvents, setCalendars, setEvents, setFilteredEvents, addEvent, addCalendar};
};

export default userDataHandler;
