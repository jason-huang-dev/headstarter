import React, { useState, useEffect, useCallback } from 'react';
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

  {/* Beginning of User Data Fetching */}
  // Reusable function to fetch data from the API and set the corresponding state
  const fetchData = async (url, setState) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
      });

      const data = await response.json();
      console.log(`Response from ${url}:`, data);

      if (response.ok) {
        setState(data);
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchData('http://localhost:8000/api/calendars/', setCalendars);
      fetchData('http://localhost:8000/api/events/', setEvents);
      fetchData('http://localhost:8000/api/invitations/', setInvitations);
    }
  }, [user?.token]);

  {/* Beginning of Event CRUD Requests */}
  // Adds a new event 
  const addEvent = useCallback(async (eventDetails) => {
    if (!eventDetails.title.trim()) {
        alert("Event title is required!"); // Show an alert if the event title is missing
        return;
    }
    console.log('Adding Event:', eventDetails);

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
      console.log('Response from Add Event:', data);

      if (response.ok) {
        setEvents(prevEvents => [...prevEvents, data]);
        setFilteredEvents(prevEvents => [...prevEvents, data]);
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  // Update an existing event
  const updateEvent = useCallback(async (updatedDetails) => {
    console.log(`Updating Event ${updatedDetails.id}:`, updatedDetails);

    try {
      const response = await fetch(`http://localhost:8000/api/events/${updatedDetails.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(updatedDetails),
      });

      const data = await response.json();
      console.log('Response from Update Event:', data);

      if (response.ok) {
        setEvents(prevEvents => prevEvents.map(event => event.id === updatedDetails.id ? data : event));
        setFilteredEvents(prevEvents => prevEvents.map(event => event.id === updatedDetails.id ? data : event));
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  // Delete an existing event
  const deleteEvent = useCallback(async (updatedDetails) => {
    console.log(`Deleting Event ${updatedDetails.id}`);

    try {
      const response = await fetch(`http://localhost:8000/api/events/${updatedDetails.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
      });

      if (response.ok) {
        setEvents(prevEvents => prevEvents.filter(event => event.id !== updatedDetails.id));
        setFilteredEvents(prevEvents => prevEvents.filter(event => event.id !== updatedDetails.id));
      } else {
        const data = await response.json();
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  {/* Beginning of Calendar CRUD Requests */}
  const addCalendar = useCallback(async (calendarDetails) => {
    console.log('Adding Calendar:', calendarDetails);

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
      console.log('Response from Add Calendar:', data);

      if (response.ok) {
        setCalendars(prevCalendars => [...prevCalendars, data]);
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  // Update an existing calendar
  const updateCalendar = useCallback(async (calendarId, updatedDetails) => {
    console.log(`Updating Calendar ${calendarId}:`, updatedDetails);

    try {
      const response = await fetch(`http://localhost:8000/api/calendars/${calendarId}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(updatedDetails),
      });

      const data = await response.json();
      console.log('Response from Update Calendar:', data);

      if (response.ok) {
        setCalendars(prevCalendars => prevCalendars.map(calendar => calendar.cal_id === calendarId ? data : calendar));
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  // Delete an existing calendar
  const deleteCalendar = useCallback(async (calendarId) => {
    console.log(`Deleting Calendar ${calendarId}`);

    try {
      const response = await fetch(`http://localhost:8000/api/calendars/${calendarId}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
      });

      if (response.ok) {
        setCalendars(prevCalendars => prevCalendars.filter(calendar => calendar.cal_id !== calendarId));
      } else {
        const data = await response.json();
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  // Add the acceptInvitation function
  const acceptInvitation = useCallback(async (invite_token, action) => {
    try {
      const response = await fetch(`http://localhost:8000/api/invitations/accept/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify({ action: action }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Invitation accepted:', data);
        // Update invitations state to reflect the change
        setInvitations(prevInvitations => prevInvitations.filter(invite => invite.token !== invite_token));
      } else {
        const error = await response.json();
        console.error('Error accepting invitation:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user.token]);

  return {
    calendars,
    shared_calendars,
    invitations,
    events,
    filteredEvents,
    setCalendars,
    setEvents,
    setFilteredEvents,
    addEvent,
    addCalendar,
    updateEvent,
    deleteEvent,
    updateCalendar,
    deleteCalendar,
    acceptInvitation
  };
};

export default userDataHandler;
