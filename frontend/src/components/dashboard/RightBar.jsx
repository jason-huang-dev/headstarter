import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

/**
 * RightBar component that provides a right sidebar navigation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isRightBarOpen - Indicates if the right sidebar is open.
 * @param {Function} props.setIsRightBarOpen - Function to set the visibility of the right sidebar.
 * @param {string} props.content - Determines what content to display in the RightBar.
 * @param {Function} props.addEventToCalendar - Function to add the event to the calendar.
 * @returns {JSX.Element} The RightBar component.
 */
export const RightBar = ({ isRightBarOpen, setIsRightBarOpen, content, addEventToCalendar }) => {
  const [eventDetails, setEventDetails] = useState({
    title: '',
    start: '',
    end: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEventDetails({ ...eventDetails, [name]: value });
  };

  const handleAddEvent = () => {
    addEventToCalendar(eventDetails); // Call the function to add the event to the calendar
    setEventDetails({ title: '', start: '', end: '' }); // Reset form
    setIsRightBarOpen(false); // Close the right bar after adding the event
  };

  return (
    <aside
      className={`fixed right-0 top-0 h-screen bg-white border-l shadow-sm transition-transform duration-300 ease-in-out w-80`}
      style={{ transform: isRightBarOpen ? 'translateX(0)' : 'translateX(100%)' }} // Slide in/out
    >
      <nav className="h-full flex flex-col overflow-x-hidden">
        {/* Rightbar's closing button on the top */}
        <div className="p-4 pb-2 flex justify-between items-center">
            <button
                onClick={() => setIsRightBarOpen(false)} 
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"> <X /> 
            </button>

            <div className="flex justify-between items-center">
              {content === 'calendar' && ( <h2 className="mr-10 text-lg font-sora font-bold">Add Calendar</h2> )}
              {content === 'event' && ( <h2 className="mr-10 text-lg font-sora font-bold">Add Event</h2> )}
            </div>
          
        </div>

        {/* Conditionally Render Content Questions for event of for calendar adding */}
        <div className="p-4">
            {/* Content for adding a calendar */}
          {content === 'calendar' && (
            <div>
              <p>This is where you can add a new calendar.</p>
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

RightBar.propTypes = {
  isRightBarOpen: PropTypes.bool.isRequired,
  setIsRightBarOpen: PropTypes.func.isRequired,
  content: PropTypes.string.isRequired,
  addEventToCalendar: PropTypes.func.isRequired, // Add prop for adding event to calendar
};
