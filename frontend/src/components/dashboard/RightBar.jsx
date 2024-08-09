import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

/**
 * RightBar component that provides a right sidebar for adding calendars or events.
 *
 * This component slides in from the right and displays different forms based on the
 * content type passed in the `content` prop. It handles the submission of new events
 * to be added to the main calendar.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isRightBarOpen - Indicates if the right sidebar is open.
 * @param {Function} props.setIsRightBarOpen - Function to set the visibility of the right sidebar.
 * @param {string} props.content - Determines what content to display in the RightBar ('calendar' or 'event').
 * @param {Function} props.addEventToCalendar - Function to add the event to the calendar.
 * @returns {JSX.Element} The RightBar component.
 */
export const RightBar = ({ isRightBarOpen, setIsRightBarOpen, content, addEventToCalendar }) => {
  // State to manage the details of the event being added
  const [eventDetails, setEventDetails] = useState({
    title: '',
    start: '',
    end: ''
  });

  /**
   * Handles input changes in the event form.
   * Updates the eventDetails state with the new values.
   *
   * @param {Object} e - The event object from the input field.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  /**
   * Handles the submission of the event form.
   * Calls the addEventToCalendar function passed from props and closes the sidebar.
   */
  const handleAddEvent = () => {
    addEventToCalendar(eventDetails); // Call the function to add the event to the calendar
    setEventDetails({ title: '', start: '', end: '' }); // Reset the form fields
    setIsRightBarOpen(false); // Close the right sidebar after adding the event
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen bg-white border-l shadow-sm transition-transform duration-300 ease-in-out w-80`}
      style={{ transform: isRightBarOpen ? 'translateX(0)' : 'translateX(100%)' }} // Slide in/out based on isRightBarOpen
    >
      <nav className="h-full flex flex-col overflow-x-hidden">
        {/* Header of the RightBar with a close button and title */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => setIsRightBarOpen(false)} 
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200">
            <X /> 
          </button>
          <div className="flex justify-between items-center">
            {content === 'calendar' && <h2 className="mr-10 text-lg font-sora font-bold">Add Calendar</h2>}
            {content === 'event' && <h2 className="mr-10 text-lg font-sora font-bold">Add Event</h2>}
          </div>
        </div>

        {/* Main content area for adding a calendar or an event */}
        <div className="p-4">
          {/* Content for adding a new calendar */}
          {content === 'calendar' && (
            <div>
              <p>This is where you can add a new calendar.</p>
              {/* Additional fields and functionality for adding a calendar can be added here */}
            </div>
          )}

          {/* Content for adding a new event */}
          {content === 'event' && (
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Event Title</label>
                <input
                  type="text"
                  name="title"
                  value={eventDetails.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Start Date & Time</label>
                <input
                  type="datetime-local"
                  name="start"
                  value={eventDetails.start}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">End Date & Time</label>
                <input
                  type="datetime-local"
                  name="end"
                  value={eventDetails.end}
                  onChange={handleInputChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                />
              </div>
              <button
                onClick={handleAddEvent}
                className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Add Event
              </button>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

// Define the PropTypes for the RightBar component
RightBar.propTypes = {
  isRightBarOpen: PropTypes.bool.isRequired, // Boolean to control the visibility of the RightBar
  setIsRightBarOpen: PropTypes.func.isRequired, // Function to set the visibility of the RightBar
  content: PropTypes.string.isRequired, // String to determine what content to show ('calendar' or 'event')
  addEventToCalendar: PropTypes.func.isRequired, // Function to add the event to the calendar
};
