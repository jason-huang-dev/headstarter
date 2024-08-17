
const colorsForEvent = [
    { color: "#15803d", label: "1" },
    { color: "#FFC876", label: "2" },
    { color: "#FF776F", label: "3" },
    { color: "#7ADB78", label: "4" },
    { color: "#858DFF", label: "5" },
    { color: "#FF98E2", label: "6" },
];
  
const calendarForm = [
    {
      label: 'Calendar Name',
      type: 'text',
      name: 'title',
      validate: (value) => value.trim() !== '' || 'Calendar Name is required.',
      required: true
    },
    {
      label: 'Add People?',
      labelAfter: true,
      name: 'addPeople',
      type: 'checkbox',
      className:"flex items-center",
      onChange: (e, formDetails, setFormDetails) => {
        const { name, checked } = e.target;
        setFormDetails({ ...formDetails, addPeople: e.target.checked });
        if (name === 'addPeople' && !checked) {
          setFormDetails({ ...formDetails, emails: '', addPeople: e.target.checked });
        }
      },
    },
    {
      label: 'Send Email Invitations:',
      name: 'emails',
      type: 'email',
      ifPrev: true,
      placeholder: 'Enter emails and press Enter',
      validate: (value) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value);
      },
      onKeyDown: (e, formDetails, setFormDetails, validate) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (formDetails.emails.trim() && validate(formDetails.emails.trim())) {
            setFormDetails({
              ...formDetails,
              email_list: [...formDetails.email_list, formDetails.emails.trim()],
              emails: ''
            });
          } else {
            alert("Please enter a valid email address.");
          }
        }
      }
    },
];
  
const eventForm = [
    {
      label: "Calendar",
      type: "select",
      name: "cal_id",
      options: [], // Update options as needed
    },
    { label: 'Event Title', type: 'text', name: 'title' },
    { label: 'Start Date & Time', name: 'start', type: 'datetime-local' },
    { label: 'End Date & Time', name: 'end', type: 'datetime-local' },
    { label: 'Select Event Color', name: 'color', type: 'select', options: colorsForEvent },
];
  
const fetchCalendars = async (token) => {
    try {
        const response = await fetch('http://localhost:8000/api/calendars/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        });

        const data = await response.json();
        if (response.ok) {
        return data;
        } else {
        console.error('Error from server:', data);
        throw new Error('Error fetching calendars');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const fetchEvents = async (token) => {
    try {
        const response = await fetch('http://localhost:8000/api/events/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        });

        const data = await response.json();
        if (response.ok) {
        return data;
        } else {
        console.error('Error from server:', data);
        throw new Error('Error fetching events');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const addEvent = async (eventDetails, token) => {
    if (!eventDetails.title.trim()) {
        alert("Event title is required!");
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/events/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(eventDetails),
        });

        const data = await response.json();
        if (response.ok) {
        return data;
        } else {
        console.error('Error from server:', data);
        throw new Error('Error adding event');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

const addCalendar = async (calendarDetails, token) => {
    try {
        const response = await fetch('http://localhost:8000/api/calendars/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Token ${token}`,
        },
        body: JSON.stringify(calendarDetails),
        });

        const data = await response.json();
        if (response.ok) {
        return data;
        } else {
        console.error('Error from server:', data);
        throw new Error('Error adding calendar');
        }
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

export {addCalendar, addEvent, fetchCalendars, fetchEvents, calendarForm, eventForm, colorsForEvent}