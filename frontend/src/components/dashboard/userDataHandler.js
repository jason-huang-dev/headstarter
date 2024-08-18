import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const userDataHandler = () => {
    const location = useLocation();

    /**
     * User object containing details about the currently authenticated user.
     * 
     * @typedef {object} User
     * @property {string} token - The authentication token for the user.
     * @property {number} user_id - The unique identifier of the user.
     * @property {string} email - The email address of the user.
     * @property {string} username - The username of the user.
     * @property {string} picture - The URL to the user's profile picture.
     * 
     * @type {User}
     */
    const user = location.state?.user;

    /**
     * Calendar object representing a calendar owned by the user.
     * 
     * @typedef {object} Calendar
     * @property {number} cal_id - The unique identifier of the calendar.
     * @property {number} user - The ID of the user who owns the calendar.
     * @property {string} title - The title of the calendar.
     * @property {string} description - A description of the calendar.
     * @property {Array<string>} shared_users - A list of emails of users with whom the calendar is shared.
     * 
     * @type {Calendar[]}
     */
    const [calendars, setCalendars] = useState([]);

    /**
     * Event object representing an event in a calendar.
     * 
     * @typedef {object} Event
     * @property {number} cal_id - The unique identifier of the calendar the event belongs to.
     * @property {string} title - The title of the event.
     * @property {string} description - A textual description of the event.
     * @property {string} start - The start date and time of the event in ISO format.
     * @property {string} end - The end date and time of the event in ISO format.
     * @property {string} bg_color - The background color of the event, in hexadecimal format.
     * @property {number} user - The ID of the user who created the event.
     * 
     * @type {Event[]}
     */
    const [events, setEvents] = useState([]);

    /**
     * FilteredEvent object representing an event that matches certain filtering criteria.
     * 
     * @typedef {Event} FilteredEvent
     * 
     * @type {FilteredEvent[]}
     */
    const [filteredEvents, setFilteredEvents] = useState([]);

    /**
     * Invitation object representing a calendar invitation sent to a user.
     * 
     * @typedef {object} Invitation
     * @property {number} inv_id - The unique identifier of the invitation.
     * @property {Calendar} calendar - The calendar associated with the invitation.
     * @property {string} email - The email address of the invitee.
     * @property {User} invited_by - The user who sent the invitation.
     * @property {string} token - A unique token for the invitation link.
     * @property {boolean} accepted - Indicates whether the invitation has been accepted.
     * @property {boolean} declined - Indicates whether the invitation has been declined.
     * @property {string} created_at - The timestamp of when the invitation was created in ISO format.
     * 
     * @type {Invitation[]}
     */
    const [invitations, setInvitations] = useState([]);

    /**
     * SharedCalendar object representing a calendar shared with the user by another user.
     * 
     * @typedef {object} Calendar
     * @property {number} cal_id - The unique identifier of the calendar.
     * @property {number} user - The ID of the user who owns the calendar.
     * @property {string} title - The title of the calendar.
     * @property {string} description - A description of the calendar.
     * @property {Array<string>} shared_users - A list of emails of users with whom the calendar is shared.
     * 
     * @type {Calendar[]}
     */
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
