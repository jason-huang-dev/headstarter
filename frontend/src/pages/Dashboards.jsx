'use client'
import React, { useState }from 'react';
import { useLocation} from 'react-router-dom';
import { SideBar } from '../components/dashboard';
import { Accordion, Button} from '../components/reusable';
import { sideBarAccordians } from '../constants';

/**
 * Dashboards component that renders the dashboard with a SideBar.
 * 
 * This component uses `useLocation` from `react-router-dom` to access user data
 * from the state passed through the location object. It then renders the `SideBar`
=======
import { Drawer } from '../components/dashboard';

/**
 * Dashboards component that renders the dashboard with a drawer/sidebar.
 * 
 * This component uses `useLocation` from `react-router-dom` to access user data
 * from the state passed through the location object. It then renders the `Drawer`
>>>>>>> 9c0deb7 (Added documentation to all compoents, on hover will give description along with taken fields)
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

  return (
    <div className="h-screen flex flex-col">
      <SideBar user={user}>
        {({ isOpen }) => (
          <div className="flex flex-col flex-grow">
            <div className="flex flex-col flex-grow overflow-y-auto">
              {sideBarAccordians.map((item, index) => (
                <Accordion
                  key={index}
                  title={item.title}
                  icon={item.iconUrl}
                  displayTitle={isOpen} 
                  isActive={activeIndices.includes(index)} // Check if index is in activeIndices
                  onTitleClick={() => handleTitleClick(index)} // Pass index to click handler
                >
                  {/* You can put content for each AccordionItem here */}
                  <p>Content for {item.title}</p>
                </Accordion>
              ))}
            </div>
            {isOpen && <Button className="mt-auto">Add Event</Button>}
          </div>
        )}
      </SideBar>
    </div>
  ); 
};

export default Dashboards;
