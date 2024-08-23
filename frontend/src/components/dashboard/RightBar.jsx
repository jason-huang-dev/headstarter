import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";
import { Button } from '../reusable';

export const RightBar = ({ isRightBarOpen, setIsRightBarOpen, content, addEventToCalendar, addCalendar }) => {
    // State to manage the details of the event being added
    const [eventDetails, setEventDetails] = useState({
      title: '',
      start: '',
      end: ''
    });
  
    // State to manage the details of the calendar being added, including the list of emails
    const [calendarDetails, setCalendarDetails] = useState({
      title: '',
      addPeople: false,
      emails: '',
      emailList: [] // Maintain a list of emails
    });
  
    // Handles input changes for the event form fields
    const handleEventInputChange = (e) => {
      const { name, value } = e.target;
      setEventDetails({ ...eventDetails, [name]: value });
    };
  
    // Handles input changes for the calendar form fields
    const handleCalendarInputChange = (e) => {
      const { name, value } = e.target;
      setCalendarDetails({ ...calendarDetails, [name]: value });
    };
  
    // Handles the checkbox change for adding people to the calendar
    const handleAddPeopleChange = (e) => {
      setCalendarDetails({ ...calendarDetails, addPeople: e.target.checked });
    };
  
    // Function to validate email format
    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };
    
    // Handle Enter key to add email to the list with validation
    const handleEmailKeyPress = (e) => {
        if (e.key === 'Enter') {
        e.preventDefault(); // Prevents the form from submitting on Enter key press
        if (calendarDetails.emails.trim() && isValidEmail(calendarDetails.emails.trim())) { // Check for non-empty and valid email
            setCalendarDetails({
            ...calendarDetails,
            emailList: [...calendarDetails.emailList, calendarDetails.emails.trim()], // Add email to the list
            emails: '' // Clear the input field
            });
        } else {
            // Optionally, you could display an error message here
            alert("Please enter a valid email address.");
        }
        }
    };
    
  
    // Function to remove an email from the email list
    const handleRemoveEmail = (index) => {
      setCalendarDetails({
        ...calendarDetails,
        emailList: calendarDetails.emailList.filter((_, i) => i !== index) // Remove email by filtering out the one at the specified index
      });
    };
  
    // Handles the submission of the event form, adds the event, and closes the right sidebar
    const handleAddEvent = () => {
      addEventToCalendar(eventDetails); // Add the event to the calendar
      setEventDetails({ title: '', start: '', end: '' }); // Reset the event form fields
      setIsRightBarOpen(false); // Close the right sidebar
    };
  

    return (
        <aside
          className={`fixed right-0 top-0 h-screen bg-white border-l shadow-sm transition-transform duration-300 ease-in-out w-80`}
          style={{ transform: isRightBarOpen ? 'translateX(0)' : 'translateX(100%)' }} // Slide the sidebar in/out based on isRightBarOpen
        >
          <nav className="h-full flex flex-col overflow-x-hidden">
            {/* Header of the RightBar with a close button and title */}
            <div className="p-4 pb-2 flex justify-between items-center">
              <button
                onClick={() => setIsRightBarOpen(false)} // Close the sidebar on click
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
                <X /> {/* Close icon */}
              </button>
              <div className="flex justify-between items-center">
                {/* Display title based on the content type */}
                {content === 'calendar' && <h2 className="mr-10 text-lg font-sora font-bold">Add Calendar</h2>}
                {content === 'event' && <h2 className="mr-10 text-lg font-sora font-bold">Add Event</h2>}
              </div>
            </div>
    
            {/* Main content area for adding a calendar or an event */}
            <div className="p-4">
              {/* Content for adding a new calendar */}
              {content === 'calendar' && (
                <div>
                  {/* Calendar Name Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Calendar Name</label>
                    <input
                      type="text"
                      name="title"
                      value={calendarDetails.title}
                      onChange={handleCalendarInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
    
                  {/* Checkbox for adding people to the calendar */}
                  <div className="mb-4 flex items-center">
                    <input
                      type="checkbox"
                      name="addPeople"
                      checked={calendarDetails.addPeople}
                      onChange={handleAddPeopleChange}
                      className="mr-2"
                    />
                    <label className="text-sm font-medium text-gray-700">Add people to the calendar?</label>
                  </div>
    
                    {/* Conditional rendering of email input field and email list */}
                    {calendarDetails.addPeople && (
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">Send Email Invitations:</label>
                        <div className="mb-2">
                        {/* Display each email with a delete button */}
                        {calendarDetails.emailList.map((email, index) => (
                            <div
                            key={index}
                            className="text-sm px-2 py-1 rounded-lg bg-slate-200 text-gray-800 inline-flex items-center mr-2 mb-2"
                            >
                            {email}
                            <button onClick={() => handleRemoveEmail(index)} // Handle email deletion on click
                            className="ml-2 text-gray-600 hover:text-gray-900">
                            <X size={14} /> {/* Small X icon for deleting the email */}
                            </button>
                            </div>
                        ))}
                        </div>
                        {/* Email input field */}
                        <input
                        name="emails"
                        value={calendarDetails.emails}
                        onChange={handleCalendarInputChange}
                        onKeyPress={handleEmailKeyPress} // Handle Enter key press to add email
                        placeholder="Enter emails and press Enter"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                        required // Make the input field required
                        type="email" // Use the "email" type to enforce basic email format validation
                        />
                    </div>
                    )}

                  {/* Button to add the calendar */}
                  <Button onClick={handleAddCalendar}>Add Calendar</Button>
                </div>
              )}
    
              {/* Content for adding a new event */}
              {content === 'event' && (
                <div>
                  {/* Event Title Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Event Title</label>
                    <input
                      type="text"
                      name="title"
                      value={eventDetails.title}
                      onChange={handleEventInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
    
                  {/* Start Date & Time Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                    <input
                      type="datetime-local"
                      name="start"
                      value={eventDetails.start}
                      onChange={handleEventInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
    
                  {/* End Date & Time Input */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                    <input
                      type="datetime-local"
                      name="end"
                      value={eventDetails.end}
                      onChange={handleEventInputChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                    />
                  </div>
    
                  {/* Button to add the event */}
                  <Button onClick={handleAddEvent}>Add Event</Button>
                </div>
              )}
            </div>
          </nav>
        </aside>
      );
    };
    
    // Define PropTypes for the RightBar component to ensure correct prop types
    RightBar.propTypes = {
      isRightBarOpen: PropTypes.bool.isRequired, // Boolean to indicate if the right sidebar is open
      setIsRightBarOpen: PropTypes.func.isRequired, // Function to toggle the visibility of the sidebar
      content: PropTypes.string.isRequired, // String to determine which content to display (calendar or event)
      addEventToCalendar: PropTypes.func.isRequired, // Function to add an event to the calendar
      addCalendar: PropTypes.func.isRequired, // Function to add a new calendar
    };