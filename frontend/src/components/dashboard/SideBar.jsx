import React, { useState } from "react";
import PropTypes from "prop-types";
import { ProfileIcon } from "../reusable";
import { iconsite } from "../../assets/png";
import { ChevronFirst, ChevronLast, CalendarPlus, Plus, Cpu} from "lucide-react";
import { googleLogout } from "@react-oauth/google";
import { Inbox } from 'lucide-react';
import { useUserContext } from "../../contexts/userDataHandler";

const SidebarContext = React.createContext();

/**
 * Drawer component that provides a sidebar navigation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} user - The user's profile to be displayed
 * @param {boolean} props.isRightBarOpen - Indicates if the right sidebar is open.
 * @param {Function} props.setIsRightBarOpen - Function to set the visibility of the right sidebar.
 * @returns {JSX.Element} The Drawer component.
 */
export const SideBar = ({ user, children, addCalendar, addEvent, openAI, isRightBarOpen, setIsOpenInbox, isOpenInbox, setIsRightBarOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {postAI} = useUserContext()

  const handleProfileIconClick = () => {
    if (!isOpen) {
      setIsDropdownOpen(!isDropdownOpen);
      toggleSidebar();
    } else if (isOpen && isDropdownOpen) {
      setIsDropdownOpen(false);
      toggleSidebar();
    } else if (isOpen && !isDropdownOpen) {
      setIsDropdownOpen(true);
    }
  };

  const toggleSidebar = () => {
    // Block opening if the screen width is less than 1160px and the right sidebar is open
    if (window.innerWidth >= 1160 || !isRightBarOpen) {
      setIsOpen((curr) => !curr);
    }
  };

  const handleSignOut = async () => {
    try {
      // Frontend: Sign out of Google OAuth
      googleLogout();

      // Backend: Sign out from Django backend
      const response = await fetch(`https://${import.meta.env.VITE_BACKEND_URL}/api/auth/signout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${user.token}`, // Replace with your token
        },
        body: JSON.stringify({
          user: user,
        }),
      });

      if (response.ok) {
        // Sign out was successful
        // console.log("Successfully signed out");
        window.location.href = '/'; // Redirect to the root (home) page
      } else {
        console.error("Failed to sign out from the backend");
      }

      // Optional: Handle any local state cleanup, e.g., redirect to login
      // redirectToLogin();
    } catch (error) {
      console.error("Sign out failed", error);
    }
  };

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
          onClick={() => {
            toggleSidebar(); // Call the toggleSidebar function
            if (isDropdownOpen) setIsDropdownOpen(false); // Close the dropdown if it's open
          }} 
          className={`p-2 rounded-lg bg-gray-100 hover:bg-gray-200 ${
            !isOpen ? "mr-1" : ""
          }`}
        >
          {isOpen ? <ChevronFirst size={32} /> : <ChevronLast size={32} />}
        </button>
      </div>

      {/* Invitations Button */}
      <div 
        className={`py-2 rounded-lg mx-4 mt-5 flex items-center 
          ${isOpen ? "justify-between px-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-200" 
                  : "justify-center transition-colors group hover:bg-gray-100 bg-white"}`}
      >
        <button
          onClick={() => {
            setIsOpenInbox(!isOpenInbox);
            setIsRightBarOpen(false); // Close the right bar
          }}
          className="flex items-center w-full"
        >
          <div className={`flex items-center justify-center ${!isOpen ? "mx-auto" : ""}`}>
            <Inbox style={{ width: '32px', height: '32px' }} />
          </div>
          {isOpen && (
            <span className="ml-3 text-sm">
              Invitations
            </span>
          )}
        </button>
      </div>

      {/* Buttons Add Calendar and Add Event */}
      <div className={`flex ${isOpen ? "flex-row" : "flex-col border-b"} justify-center mx-4 py-4`}>
        <div className="flex flex-col items-center mx-3 my-1">
          <button
            onClick={() => {
              addCalendar(setIsOpen);
              if (isOpenInbox) setIsOpenInbox(false); // Close the Inbox if it's open
            }}
            className={`py-2 rounded-lg 
            ${isOpen ? "px-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-200" : "px-3 transition-colors group hover:bg-gray-100 bg-white"}`}
          >
            <CalendarPlus style={{ width: "30px", height: "30px" }} />
          </button>
          {isOpen && <span className="mt-2 text-sm">Add Calendar</span>}
        </div>

        <div className="flex flex-col items-center mx-3 my-1">
          <button
            onClick={() => {
              addEvent(setIsOpen);
              if (isOpenInbox) setIsOpenInbox(false);  // Close the Inbox if it's open
            }}
            className={`py-2 rounded-lg 
            ${isOpen ? "px-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-200" : "px-3 transition-colors group hover:bg-gray-100 bg-white"}`}
          >
            <Plus style={{ width: "30px", height: "30px" }} />
          </button>
          {isOpen && <span className="mt-2 text-sm">Add Event</span>}
        </div>
      </div>

      {/* Button for AI */}
      <div className={`flex ${isOpen ? "flex-row" : "flex-col border-b"} justify-center mx-4 py-4`}>
        <div className="flex flex-col items-center mx-3 my-1">
          <button
            onClick={() => {
              openAI(setIsOpen);
              if (isOpenInbox) setIsOpenInbox(false); // Close the Inbox if it's open
            }}
            className={`py-2 rounded-lg 
            ${isOpen ? "px-3 bg-gray-100 hover:bg-gray-200 transition-colors duration-200" : "px-3 transition-colors group hover:bg-gray-100 bg-white"}`}
          >
            <Cpu style={{ width: "30px", height: "30px" }} />
          </button>
          {isOpen && <span className="mt-2 text-sm">Chrony AI</span>}
        </div>
      </div>
  
      <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
        <ul className="overflow-y-auto flex-1 px-3 py-5">
          {children({ isOpen, setIsOpen })}
        </ul>
      </SidebarContext.Provider>
  
      {/* SideBar's profile icon and name overview at the 
                bottom of the sidebar. Pfp centers when closed */}
      <div className="border-t flex p-3 items-center">
        <div className={`flex ${isOpen ? "w-full justify-start" : "mx-3 justify-center"}`}>
          <ProfileIcon user={user} size={35} username={isOpen} onSignOut={handleSignOut} isDropdownOpen={isDropdownOpen} handleProfileIconClick={handleProfileIconClick} />
        </div>
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
  isRightBarOpen: PropTypes.bool.isRequired, // Prop for right bar state
  setIsRightBarOpen: PropTypes.func.isRequired, // Prop for toggling right bar
  isOpenInbox: PropTypes.bool.isRequired, // Prop for inbox state
  setIsOpenInbox: PropTypes.func.isRequired, // Prop for toggling inbox state
};
