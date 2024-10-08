import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { parseISO, format, addDays, isSameDay, startOfDay, setHours, setMinutes, setSeconds } from 'date-fns';

const UserContext = createContext();

const UserProvider = ({ children }) => {
  const location = useLocation();
  const backend_url = import.meta.env.VITE_BACKEND_URL
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

  /**
   * SharedCalendar object representing a calendar shared with the user by another user.
   * 
   * @property {Array<Objects>} messages - A list of emails of users with whom the calendar is shared.
   * @property {string} role - The sender of the message "assistant" for the AI and "user" for the actual messager
   * @property {string} message - The message from the sender
   */
  const [messages, setMessages] = useState([
    { 
      role: "assistant",
      content: 
      `
        🐢 Greetings! 
        I’m Chrony, your personal scheduling assistant. 
        I’m here to ensure your calendar is organized and efficient.
        If you want me to generate events please include "generate events" in your request
        How can I assist you in managing your time today?
      `
    }
  ]);

  /**
   * 
   */
  const updateHandlers = {
    calendars: () => {
      fetchData(`${backend_url}/api/calendars/`, setCalendars);
    },
    events: () => {
      fetchData(`${backend_url}/api/events/`, setEvents);
    },
    invitations: () => {
      fetchData(`${backend_url}/api/invitations/`, setInvitations);
    },
    shared_calendars: () => {
      fetchData(`${backend_url}/api/calendars/shared/`, setSharedCalendars);
    }
  };

  const processEvents = (events) => {
    return events.map(event => {
      // Parse the original event times
      const startDate = parseISO(event.start);
      const endDate = parseISO(event.end);
      
      // Process recurring dates if they exist
      let recurringDates = [];
      if (event.repeat_type !== 'NONE' && event.repeated_dates && Array.isArray(event.repeated_dates)) {
        recurringDates = event.repeated_dates.map(date => {
          const recurrenceDate = parseISO(date);
          
          // Calculate the duration of the original event
          const duration = endDate.getTime() - startDate.getTime();
          const recurrenceEnd = new Date(recurrenceDate.getTime() + duration);
  
          return {
            id: `${event.id}_${date}`,
            title: `${event.title}`,
            start: format(recurrenceDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
            end: format(recurrenceEnd, "yyyy-MM-dd'T'HH:mm:ssXXX"),
            bg_color: event.bg_color,
            isRecurring: true,
            originalEventId: event.id,
            originalStart: event.start,
            originalEnd: event.end
          };
        });
      }
      
      return {
        ...event,
        start: format(startDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        end: format(endDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
        recurringDates: recurringDates
      };
    });
  };

  {/* Beginning of User Data Fetching */}
  // Reusable function to fetch data from the API and set the corresponding state
  const fetchData = async (url, setState, setState2 = null) => {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        if (url.includes('/api/events/')) {
          const processedEvents = processEvents(data);
          setState(processedEvents);
          if (setState2) setState2(processedEvents);
        } else {
          setState(data);
          if (setState2) setState2(data);
        }
      } else {
        if (data.message === "No invitations found"){
          setInvitations([])
        }
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchData(`${backend_url}/api/calendars/`, setCalendars);
      fetchData(`${backend_url}/api/events/`, setEvents);
      fetchData(`${backend_url}/api/invitations/`, setInvitations);
      fetchData(`${backend_url}/api/calendars/shared/`, setSharedCalendars);
    }
  }, [user?.token]);

  {/* Beginning of Event CRUD Requests */}
  // Check for valid end and start time
  const isEndTimeAfterStartTime = (start, end) => {
    return new Date(end) >= new Date(start);
  };

  // Function used to verify contents in event details form
  const verifyEventDetails = (eventDetails) => {
    if(!eventDetails.title.trim() || !eventDetails.start.trim() || !eventDetails.end.trim()){
      alert("Please fill in all fields");
      return;
    }

    if (!isEndTimeAfterStartTime(eventDetails.start, eventDetails.end)) {
      alert("End time must be after Start time");
      return;
    }

    // Convert local time to UTC
    const formatDateToUTC = (dateString) => {
      const date = new Date(dateString);
      return date.toISOString();
    };

    const updatedStart = formatDateToUTC(eventDetails.start);
    const updatedEnd = formatDateToUTC(eventDetails.end);
  
    eventDetails = {
      ...eventDetails,
      start: updatedStart,
      end: updatedEnd,
    };

    return eventDetails
  }

  // Adds a new event 
  const addEvent = useCallback(async (eventDetails) => {
    eventDetails = verifyEventDetails(eventDetails)
    // const controller = new AbortController();
    // const timeoutId = setTimeout(() => controller.abort(), 20000);  
    // console.log("Start addEvent", eventDetails)
    if(!eventDetails){
      return;
    }
  
    try {
      // console.log("Start Try", eventDetails)
      const response = await fetch(`${backend_url}/api/events/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(eventDetails),
        // signal: controller.signal, // pass the signal for abort
      });
      // clearTimeout(timeoutId);
      // console.log("Response object:", response)
      const data = await response.json();

      if (response.ok) {
        // Process the new event data
        const processedEvent = processEvents([data])[0];
        setEvents((prevEvents) => [...prevEvents, processedEvent]);
        alert("Sucessfully Created Event")
        // console.log(processedEvent)
        return processedEvent; // Return the processed event
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token, processEvents]);
  

  // Update an existing event
  const updateEvent = useCallback(async (updatedDetails) => {
    // console.log(`Updating Event ${updatedDetails.id}:`, updatedDetails);

    updatedDetails = verifyEventDetails(updatedDetails);
    if (!updatedDetails) {
      return;
    }

    try {
      const response = await fetch(`${backend_url}/api/events/${updatedDetails.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(updatedDetails),
      });
      const data = await response.json();

      if (response.ok) {
        // Process the updated event data
        const processedEvent = processEvents([data])[0];
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.map(event => {
            if (event.id === processedEvent.id) {
              return processedEvent;
            }
            // Update recurring instances
            if (event.originalEventId === processedEvent.id) {
              const recurrenceDate = new Date(event.start);
              const duration = new Date(processedEvent.end) - new Date(processedEvent.start);
              const recurrenceEnd = new Date(recurrenceDate.getTime() + duration);
              return {
                ...event,
                title: processedEvent.title,
                bg_color: processedEvent.bg_color,
                start: format(recurrenceDate, "yyyy-MM-dd'T'HH:mm:ssXXX"),
                end: format(recurrenceEnd, "yyyy-MM-dd'T'HH:mm:ssXXX"),
                originalStart: processedEvent.start,
                originalEnd: processedEvent.end
              };
            }
            return event;
            });
          return updatedEvents;
        });
        alert("Sucessfully Updated Event")
        return processedEvent; // Return the processed event
      } 
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token, processEvents]);

  // Delete an existing event
  const deleteEvent = useCallback(async (updatedDetails) => {
    // console.log(`Deleting Event ${updatedDetails.id}`);

    try {
      const response = await fetch(`${backend_url}/api/events/${updatedDetails.id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
      });

      if (response.ok) {
        setEvents(prevEvents => {
          const updatedEvents = prevEvents.filter(event => event.id !== updatedDetails.id);
          // console.log('Updated Events:', updatedEvents);
          alert("Event Sucessfully Deleted")
          return updatedEvents;
        });

      } else {
        const data = await response.json();
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token]);

  {/* Beginning of Calendar CRUD Requests */}
  const addCalendar = useCallback(async (calendarDetails) => {
    // console.log('Adding Calendar:', calendarDetails);

    try {
      const response = await fetch(`${backend_url}/api/calendars/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(calendarDetails),
      });

      const data = await response.json();
      // console.log('Response from Add Calendar:', data);
      if (response.ok) {
        setCalendars(prevCalendars => [...prevCalendars, data.calendar]);
        alert("Calendar Sucessfully Added")
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token]);

  // Update an existing calendar
  const updateCalendar = useCallback(async (cal_id, updatedDetails) => {
    // console.log(`Updating Calendar ${cal_id}:`, updatedDetails);

    try {
      const response = await fetch(`${backend_url}/api/calendars/${cal_id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify(updatedDetails),
      });

      const data = await response.json();
      // console.log('Response from Update Calendar:', data);

      if (response.ok) {
        setCalendars(prevCalendars => prevCalendars.map(calendar => calendar.cal_id === cal_id ? data.calendar : calendar));
        alert("Calendar Sucessfully Updated")
      } else {
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token]);

  // Delete an existing calendar
  const deleteCalendar = useCallback(async (calendarDetails) => {
    // console.log("Deleting Calendar: ",  calendarDetails);

    try {
      const response = await fetch(`${backend_url}/api/calendars/${calendarDetails.cal_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
      });

      if (response.ok) {
        setCalendars(prevCalendars => prevCalendars.filter(calendar => calendar.cal_id !== calendarDetails.cal_id));
        setEvents(prevEvents => prevEvents.filter(event => event.cal_id !== calendarDetails.cal_id));
        alert(`Deleted Calendar: ${calendarDetails.title}`)
      } else {
        const data = await response.json();
        if (data.error === "Cannot delete the last calendar"){
          alert("You must have at least 1 personal calendar");
        }
        console.error('Error from server:', data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token]);

  // Add the acceptInvitation function
  const acceptInvitation = useCallback(async (invite_token, action) => {
    try {
      const response = await fetch(`${backend_url}/api/invitations/accept/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify({ 
          action: action, 
          token: invite_token
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // console.log('Invitation accepted:', data);
        // Update invitations state to reflect the change
        setInvitations(prevInvitations => prevInvitations.filter(invite => invite.token !== invite_token));
        fetchData(`${backend_url}/api/events/`, setEvents);
        fetchData(`${backend_url}/api/calendars/shared/`, setSharedCalendars);
        alert('Invitation Acceptance Successful!');
      } else {
        const error = await response.json();
        console.error('Error accepting invitation:', error);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }, [user?.token]);

  const postAI = async (message) => {
    // console.log("Message to send to AI: ", message)
    try{
      const response = await fetch(`${backend_url}/api/ai/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify({ 
          messages: [...messages, message]
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prevMessages => {
          const newMessages = [
            ...prevMessages, 
            message, 
            {
              role: "assistant",
              content: data.message
            }];
          // console.log('Array after response:', newMessages);
          return newMessages;
      });
        data.update.forEach(updateType => {
          if (updateHandlers[updateType]) {
            updateHandlers[updateType]();
          }
        });
        // console.log('Received AI response: ', data.message);
      } else {
        const error = await response.json();
        console.error('Error receiving AI response: ', error);
      }
      return true;  // Indicates that messages has been updated
    }
    catch (error){
      console.error('Error:', error);
      setMessages((messages) => [
        ...messages, 
        message, 
        {
          role: "assistant",
          content: "Sorry, I'm not able to respond right now. Please try again later."
        }
      ])
      return true;  // Indicates that messages has been updated
    }
  }

  const postImportCal = async (importCalenderDetails) => {
    // console.log("Processing Import Request:", importCalenderDetails);
    alert("Processing Import Request May Take a Few Seconds")
    try {
        // Create a FormData object
        const formData = new FormData();

        // Append each field to the FormData object
        Object.keys(importCalenderDetails).forEach(key => {
            formData.append(key, importCalenderDetails[key]);
        });

        const response = await fetch(`${backend_url}/api/calendars/import/`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${user.token}`,
                // No 'Content-Type' header is needed when using FormData; it will be set automatically
            },
            body: formData,
        });

        if (!response.ok) {
            // Handle response errors, e.g., 4xx or 5xx HTTP status codes
            const errorText = await response.text();
            throw new Error(`Error ${response.status}: ${errorText}`);
        }

        // Parse the JSON response
        const data = await response.json();
        // console.log("Import Successful:", data);

        // Handle the successful response, e.g., show a message or update UI
        // Example: display a success message
        fetchData(`${backend_url}/api/calendars/`, setCalendars);
        fetchData(`${backend_url}/api/events/`, setEvents);  
        alert('Import successful!');
    } catch (error) {
        console.error("Error during import:", error.message);
        // Handle or display the error as needed
        alert(`Import failed: ${error.message}`);
    }
  };

  

  const postExportCal = async (exportCalenderDetails, filteredEvents) => {
    // console.log("Processing Export Request:", filteredEvents);
    alert("Processing Export Request May Take a Few Seconds")
    try {
      const response = await fetch(`${backend_url}/api/calendars/export/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`,
        },
        body: JSON.stringify({ 
          cal_title: exportCalenderDetails.title,
          events: filteredEvents
        }),
      });
  
      if (!response.ok) {
        // Handle response errors, e.g., 4xx or 5xx HTTP status codes
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }
  
      // Handle the file download
      const blob = await response.blob();
      // console.log("Result: ", blob)
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'calendar.ics'; // Set the file name for the downloaded file
      document.body.appendChild(link);
      link.click();
      link.remove();
  
      // Optionally, revoke the object URL after the download
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error during export:", error.message);
      // Handle or display the error as needed
    }
  };
  


  return (
    <UserContext.Provider
      value={{
        calendars,
        shared_calendars,
        invitations,
        events,
        messages,
        postAI,
        setCalendars,
        setEvents,
        setMessages,
        addEvent,
        addCalendar,
        updateEvent,
        deleteEvent,
        updateCalendar,
        deleteCalendar,
        acceptInvitation,
        postImportCal,
        postExportCal,
        processEvents,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const useUserContext = () => useContext(UserContext);

export { UserProvider, useUserContext };