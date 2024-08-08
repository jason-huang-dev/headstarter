'use client'
import React, {useContext, createContext, useState} from "react";
import PropTypes from "prop-types";
import { ProfileIcon } from "../reusable";
import { iconsite} from "../../assets/png";
import { ChevronFirst, ChevronLast, MoreVertical, CalendarPlus, Plus } from "lucide-react";

const SidebarContext = createContext()

/**
 * Drawer component that provides a sidebar navigation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object containing user data.
 * @param {string} props.user.username - The username of the user.
 * @param {string} props.user.picture - The profile picture URL of the user.
 * @returns {JSX.Element} The Drawer component.
 */
export const SideBar = ({ user, children, addCalendar, addEvent }) => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <aside
          className={`h-screen transition-width duration-300 ease-in-out ${
            isOpen ? "w-64" : "w-20"
          }`}
        >
          <nav className="h-full flex flex-col bg-white border-r shadow-sm overflow-x-hidden">
            {/* Sidebar's top section with the site logo and toggle button */}
            <div className="p-4 pb-2 flex justify-between items-center">
              <div className="flex justify-between items-center">
                <img
                  src={iconsite}
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    isOpen ? "w-[40px]" : "w-0"
                  }`}
                  alt="Logo"
                />
                {isOpen && <h2 className="mx-2 text-lg font-sora font-bold">TimeMesh</h2>}
              </div>
              <button
                onClick={() => setIsOpen((curr) => !curr)}
                className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 ${!isOpen ? 'mr-1' : ''}`}
              >
                {isOpen ? <ChevronFirst size={32} /> : <ChevronLast size={32} />}
              </button>
            </div>
      
            {/* Buttons Add Calendar and Add Event */}
            <div className={`flex ${isOpen ? 'flex-row' : 'flex-col border-b'} justify-center mx-4 py-4`}>
              <div className="flex flex-col items-center mx-3 my-1">
                <button
                  onClick={() => addCalendar()}
                  className={`py-2 rounded-lg ${isOpen ? 'px-4 bg-gray-100 hover:bg-gray-200' : 'px-3 transition-colors group hover:bg-gray-100 bg-white'}`}
                >
                  <CalendarPlus style={{ width: '30px', height: '30px' }} />
                </button>
                {isOpen && <span className="mt-2 text-sm">Add Calendar</span>}
              </div>
              <div className="flex flex-col items-center mx-3 my-1">
                <button
                  onClick={() => addEvent()}
                  className={`py-2 rounded-lg ${isOpen ? 'px-3 bg-gray-100 hover:bg-gray-200' : 'px-3 transition-colors group hover:bg-gray-100 bg-white'}`}
                >
                  <Plus style={{ width: '30px', height: '30px' }} />
                </button>
                {isOpen && <span className="mt-2 text-sm">Add Event</span>}
              </div>
            </div>
      
            <SidebarContext.Provider value={{ isOpen }}>
              <ul className="overflow-y-auto flex-1 px-3 py-5">{children({ isOpen })}</ul>
            </SidebarContext.Provider>
      
            {/* SideBar's profile icon and name overview at the 
                      bottom of the sidebar. Pfp centers when closed */}
            <div className="border-t flex p-3 items-center">
              <div className={`flex ${isOpen ? 'w-full justify-center' : 'mx-3'}`}>
                <ProfileIcon user={user} size={35} username={isOpen}></ProfileIcon>
              </div>
              {isOpen && <MoreVertical size={30} className="ml-auto" />}
            </div>
          </nav>
        </aside>
      );
      
};



// Prop types for validation
SideBar.propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }).isRequired,
  };

