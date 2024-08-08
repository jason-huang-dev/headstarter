import React, {useState} from 'react';
import { useLocation } from 'react-router-dom';
import { SideBar, CalendarOverview } from '../components/dashboard';
import { sideBarAccordians } from "../constants/index"; // import text contents from constants/index.js
import {Accordion, AccordionItem} from '../components/reusable';

import {ContactRound, Handshake, Apple} from "lucide-react";

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
  const user = location.state?.user; // Access user data from state
  const [activeIndices, setActiveIndices] = useState([]); // Manage active accordion states

  const handleTitleClick = (index) => {
    setActiveIndices((prevIndices) => 
      prevIndices.includes(index)
        ? prevIndices.filter((i) => i !== index) // Remove index if already active
        : [...prevIndices, index] // Add index if not active
    );
  };


  // Add calendar function that is passed to the Sidebar
  const addCalendar = () => {
    console.log("addCalendar is activated");
  };

  // Add Event function that is passed to the Sidebar
  const addEvent = () => {
    console.log("addEvent is activated");
  };

  // Example accordion items
  const exampleItems = [
      { id: 1, title: "Example Item 1", icon: ContactRound},
      { id: 2, title: "Example Item 2", icon: Handshake},
      { id: 3, title: "Example Item 3", icon: Apple},
      { id: 1, title: "Example Item 1", icon: ContactRound},
      { id: 2, title: "Example Item 2", icon: Handshake},
      { id: 3, title: "Example Item 3", icon: Apple},
      { id: 1, title: "Example Item 1", icon: ContactRound},
      { id: 2, title: "Example Item 2", icon: Handshake},
      { id: 3, title: "Example Item 3", icon: Apple},
  ];

  return (
    <div className="flex h-screen font-sora">

      {/* SideBar Component */}
      <SideBar user={user} addCalendar={addCalendar} addEvent={addEvent}>
      {({ isOpen }) => (
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow">
              {sideBarAccordians.map((item, index) => (
                <Accordion
                  key={index}
                  title={item.title}
                  icon={item.iconUrl}
                  displayTitle={isOpen} 
                  isActive={isOpen && activeIndices.includes(index)} // Check if index is in activeIndices, pass isOpen and activeIndices display Accordion icons without grey bg when sidebar is closed
                  onTitleClick={() => handleTitleClick(index)} // Pass index to click handler
                >
                  {exampleItems.map((exampleItem) => (
                    <AccordionItem
                      key={exampleItem.id}
                      title={exampleItem.title}
                      IconComponent={exampleItem.icon} // Pass the icon component
                      displayTitle={isOpen}
                      isActive={isOpen && activeIndices.includes(index)}
                      onTitleClick={() => handleTitleClick(index)}
                      link={`/dashboards/${exampleItem.id}`} // Example link, adjust as needed
                    />
                  ))}
                </Accordion>
              ))}
            </div>
          </div>
        )} 
      </SideBar>

      {/* Main calendar view component */}
      <div className="flex-grow h-full">
      <CalendarOverview />
      </div>
    </div>
  ); 
};

export default Dashboards;

