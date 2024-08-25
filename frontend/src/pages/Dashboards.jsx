import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { sideBarAccordians, calendarForm, eventForm, colorsForEvent } from "../constants"; 
import { Accordion, AccordionItem, RightBar, Popup, Form, Button } from '../components/reusable';
import { SideBar, CalendarOverview, InboxOverview} from '../components/dashboard';
import { useUserContext } from '../contexts/userDataHandler';
import { X , Inbox, Calendar as CalendarIcon} from 'lucide-react';
import {CalendarUser} from "../assets/svg";


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
  const [isOpenInbox, setIsOpenInbox] = useState(false)
  const [popupIsOpen, setPopupIsOpen] = useState(false);
  const {calendars, shared_calendars, events, addCalendar, addEvent, updateCalendar, deleteCalendar} = useUserContext();
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [filteredEvents, setFilteredEvents] = useState(events||[])
  const [calendarFormFields, setCalendarFormFields] = useState({
    title: '',
    addPeople: false,
    emails: '',
    email_list: [] // Maintain a list of emails
  })
  const [eventFormFields, setEventFormFields] = useState({
    cal_id: 'None',
    title: '',
    start: '',
    end: '',
    color: '#15803d', // Default color selection
  })

  useEffect(() => {
    // Set filtered events to all events pertaining to user
    setFilteredEvents(events)

    // Function to handle screen resizing
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setPopupIsOpen(width < 1150); // Set popupIsOpen based on the screen width
    };

    // Attach event listener for resize
    window.addEventListener('resize', handleResize);

    // Initial check when the component mounts
    handleResize();

    // Cleanup function to remove the event listener
    return () => window.removeEventListener('resize', handleResize);
  }, [events]);

  const handleTitleClick = (index) => {
    console.log(`Title clicked: ${index}`);
    setActiveIndices((prevIndices) => 
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index) 
        : [...prevIndices, index] 
    );
  };

  const handleItemClick = (cal_id) => {
    console.log(`Calendar clicked with ID: ${cal_id}`);
    
    setActiveItems((prevIndices) => {
      // Toggle the active item
      const updatedIndices = prevIndices.includes(cal_id)
        ? prevIndices.filter((i) => i !== cal_id)
        : [...prevIndices, cal_id];
      
      // Filter events based on the updated active items
      const newFilteredEvents = events.filter(event =>
        updatedIndices.includes(event.cal_id)
      );
      
      setFilteredEvents(newFilteredEvents);
      return updatedIndices;
    });
  };

  const handleEditClick = (cal_id) => {
    const calendar = calendars.find(cal => cal.cal_id === cal_id)
    console.log("Edit clicked: ", calendar);
  
    // Extract email addresses from shared_users, but only people that are registered
    const emailList = calendar.shared_users ? calendar.shared_users.map(user => user.email) : [];
  
    setCalendarFormFields({
      cal_id: calendar.cal_id,
      title: calendar.title,
      addPeople: emailList.length > 0, // true if there are shared users
      emails: '',
      email_list: emailList // Set the extracted email list
    });
  
    setRightBarContent('edit_calendar');
    setIsRightBarOpen(true);
  }

  const addCalendarHandler = (setIsOpen) => {
    setRightBarContent('add_calendar'); 
    setCalendarFormFields({
      title: "",
      addPeople: false, // true if there are shared users
      emails: '',
      email_list: [] // Set the extracted email list
    });
    setIsRightBarOpen(true); 
    setIsOpen(false);
  };
  
  const addEventHandler = (setIsOpen) => {
    setRightBarContent('event'); 
    setEventFormFields({
      ...eventFormFields, 
      cal_id: calendars.length > 0 ? calendars[0].cal_id : 'None'
    })
    setIsRightBarOpen(true); 
    setIsOpen(false); 
  };

  const submitAddCalendar = (calendarDetails) =>{
    addCalendar(calendarDetails);
    setIsRightBarOpen(false);
  }

  const submitEditCalendar = (calendarDetails) =>{
    console.log("Calendar Update: ", calendarDetails)
    updateCalendar(calendarDetails.cal_id,calendarDetails)
    setIsRightBarOpen(false);
  }

  const handleCalendarDelete = (calendarDetails) =>{
    console.log("Delete Calendar: ", calendarDetails)
    deleteCalendar(calendarDetails)

    setIsRightBarOpen(false);
  }

  const submitAddEvent = (eventDetails) =>{
    addEvent(eventDetails);
    // Filter events based on the updated active items
    const newFilteredEvents = events.filter(event =>
      updatedIndices.includes(event.cal_id)
    );
    setFilteredEvents(newFilteredEvents)
    console.log("Events after addition: ", events)
    setIsRightBarOpen(false);
  }

  const accordians = sideBarAccordians(calendars, shared_calendars)

  return (
    <div className="flex h-screen font-sora">
      {/* SideBar Component */}
      <SideBar user={user} addCalendar={addCalendarHandler} addEvent={addEventHandler} isRightBarOpen={isRightBarOpen}>
        {({ isOpen, setIsOpen }) => (
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow">
              {accordians.map((item, index) => (
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
                {item.contents.map((content) => (
                  <AccordionItem
                    key={content[item.content_key]}
                    title={content[item.content_title]}
                    displayTitle={isOpen}
                    isActive={isOpen && activeItems.includes(content[item.content_key])}
                    onTitleClick={() => handleItemClick(content[item.content_key])}
                    onEditClick={() => handleEditClick(content[item.content_key])}
                    editableContent={item.editable_content}
                    // link={`/dashboards/${calendar.cal_id}`} 
                  />
                ))}
                </Accordion>
              ))}
              <div className="border-t border-gray-300 my-2"></div> {/*Horizontal Line*/}
              <div className={`relative flex flex-col py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-green-200 ${isOpenInbox ? 'bg-green-300' : ''}`}>
              <div 
                  className={`accordion-title flex items-center w-full justify-center`} 
                  onClick={() => {setIsOpenInbox(!isOpenInbox)}}
                  >
                  <div className={`flex items-center justify-center w-full`}>
                    <div className="flex items-center justify-center leading-4">
                      <Inbox style={{ width: '32px', height: '32px' }}/>
                    </div>
                    {(isOpen && <span className="ml-2 text-sm">
                      Invitations
                    </span>)}
                  </div>
              </div>
            </div>
          </div>
        </div>
      )} 
      </SideBar>

      {/* Main calendar view component */}
      {!isOpenInbox && (<div className={`flex-grow h-full ${isRightBarOpen ? 'pr-100' : ''}`}>
        {/* Pass filteredEvents and rightbar handlers to CalendarOverview */}
        <CalendarOverview 
          events={filteredEvents}
          isRightBarOpen={isRightBarOpen} 
          setIsRightBarOpen={setIsRightBarOpen} 
          rightBarContent={rightBarContent} 
          setRightBarContent={setRightBarContent} 
          popupIsOpen={popupIsOpen} 
          />  
      </div>)}
      
      {isOpenInbox && (<div className={`flex-grow h-full ${isRightBarOpen ? 'pr-100' : ''}`}>
        <InboxOverview/>
      </div>)}

      {/* Content for adding a new calendar */}
      {/* if screen width is less than 1050 px, breaking point, Pop up opens */}
      {isRightBarOpen && (rightBarContent === 'add_calendar' || rightBarContent === 'edit_calendar') && (
        screenWidth > 1150 ? (
          <RightBar 
            isRightBarOpen={isRightBarOpen} 
            setIsRightBarOpen={setIsRightBarOpen} 
            rightBarTitle={rightBarContent === 'add_calendar' ? "Add Calendar" : "Edit Calendar"}
            className="fixed right-0 top-0 h-screen w-80"
          >
            <Form
              formFields={calendarFormFields}
              fields={calendarForm}
            >
              {({ formDetails, setFormDetails }) => (
                <div className="mb-2">
                  {/* Display each email with a delete button */}
                  {formDetails.email_list.map((email, index) => (
                    <div
                      key={index}
                      className="text-sm px-2 py-1 rounded-lg bg-slate-200 text-gray-800 inline-flex items-center mr-2 mb-2"
                    >
                      {email}
                      <button 
                        onClick={() => setFormDetails({
                          ...formDetails,
                          email_list: formDetails.email_list.filter((_, i) => i !== index) // Remove email by filtering out the one at the specified index
                        })}
                        className="ml-2 text-gray-600 hover:text-gray-900"
                      >
                        <X size={14} /> {/* Small X icon for deleting the email */}
                      </button>
                    </div>
                  ))}
                  <Button onClick={() => rightBarContent === 'add_calendar' ? submitAddCalendar(formDetails): submitEditCalendar(formDetails)}>
                    {rightBarContent === 'add_calendar' ? "Add Calendar" : "Edit Calendar"}
                  </Button>
                  {rightBarContent === 'edit_calendar' && (
                    <Button 
                      className="text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() => handleCalendarDelete(formDetails)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </Form>
          </RightBar>
        ) : (
          <Popup 
            isOpen={isRightBarOpen} 
            onClose={() => setIsRightBarOpen(false)} 
            title={rightBarContent === 'add_calendar' ? "Add Calendar" : "Edit Calendar"}
          >
            <Form
              formFields={calendarFormFields}
              fields={calendarForm}
            >
              {({ formDetails, setFormDetails }) => (
                <div className="mb-2">
                  {/* Display each email with a delete button */}
                  {formDetails.email_list.map((email, index) => (
                    <div
                      key={index}
                      className="text-sm px-2 py-1 rounded-lg bg-slate-200 text-gray-800 inline-flex items-center mr-2 mb-2"
                    >
                      {email}
                      <button 
                        onClick={() => setFormDetails({
                          ...formDetails,
                          email_list: formDetails.email_list.filter((_, i) => i !== index) // Remove email by filtering out the one at the specified index
                        })}
                        className="ml-2 text-gray-600 hover:text-gray-900"
                      >
                        <X size={14} /> {/* Small X icon for deleting the email */}
                      </button>
                    </div>
                  ))}
                  <Button onClick={() => rightBarContent === 'add_calendar' ? submitAddCalendar(formDetails): submitEditCalendar(formDetails)}>
                    {rightBarContent === 'add_calendar' ? "Add Calendar" : "Edit Calendar"}
                  </Button>
                  {rightBarContent === 'edit_calendar' && (
                    <Button 
                      className="text-white bg-red-700 hover:bg-red-800 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      onClick={() => handleCalendarDelete(formDetails)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              )}
            </Form>
          </Popup>
        )
      )}


    {/* Content for adding a new event */}
    {isRightBarOpen && rightBarContent === 'event' && (
      screenWidth > 1150 ? (
        <RightBar 
          isRightBarOpen={isRightBarOpen} 
          setIsRightBarOpen={setIsRightBarOpen} 
          rightBarTitle="Add Event"
          className="fixed right-0 top-0 h-screen w-80"
        >
          <Form
            formFields={eventFormFields}
            fields={eventForm(calendars)}
          >
            {({ formDetails, setFormDetails }) => (
              <div className="mb-2">
                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
                  <div className="flex items-center space-x-2 mt-2">
                    {colorsForEvent.map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="color"
                          value={option.color}
                          checked={formDetails.color === option.color}
                          onChange={(e) => setFormDetails({ ...formDetails, color: e.target.value })}
                          className="hidden"
                        />
                        <span
                          className="w-6 h-6 rounded-full cursor-pointer"
                          style={{
                            backgroundColor: option.color,
                            border: formDetails.color === option.color ? '2px solid #94a3b8' : '2px solid transparent',
                          }}
                        ></span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={() => submitAddEvent(formDetails)}>Add Event</Button>
              </div>
            )}
          </Form>
        </RightBar>
      ) : (
        <Popup 
          isOpen={isRightBarOpen} 
          onClose={() => setIsRightBarOpen(false)} 
          title="Add Event"
        >
          <Form
            formFields={eventFormFields}
            fields={eventForm(calendars)}
          >
            {({ formDetails, setFormDetails }) => (
              <div className="mb-2">
                {/* Color Selection */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Select Event Color</label>
                  <div className="flex items-center space-x-2 mt-2">
                    {colorsForEvent.map((option, index) => (
                      <label key={index} className="flex items-center">
                        <input
                          type="radio"
                          name="color"
                          value={option.color}
                          checked={formDetails.color === option.color}
                          onChange={(e) => setFormDetails({ ...formDetails, color: e.target.value })}
                          className="hidden"
                        />
                        <span
                          className="w-6 h-6 rounded-full cursor-pointer"
                          style={{
                            backgroundColor: option.color,
                            border: formDetails.color === option.color ? '2px solid #94a3b8' : '2px solid transparent',
                          }}
                        ></span>
                      </label>
                    ))}
                  </div>
                </div>
                <Button onClick={() => submitAddEvent(formDetails)}>Add Event</Button>
              </div>
            )}
          </Form>
        </Popup>
      )
    )}
    </div>
  ); 
};

export default Dashboards;