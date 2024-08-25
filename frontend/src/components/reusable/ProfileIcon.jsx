import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; // Optional, for conditional class names
import { LogOut } from 'lucide-react'; 

/**
 * ProfileIcon component displays a user's profile icon and optionally their username.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object containing user data.
 * @param {string} props.user.username - The username of the user.
 * @param {string} props.user.picture - The profile picture URL of the user.
 * @param {Function} props.onSignOut - Function to handle user sign-out.
 * @param {number} [props.size=60] - The size of the profile icon in pixels. Defaults to 60.
 * @param {boolean} [props.username=true] - Boolean for display of username. Defaults to true.
 * @param {string} [props.bgColor="bg-color-color-4"] - Background color for the profile icon. Defaults to "bg-color-color-4".
 * @param {boolean} props.isSidebarOpen - Boolean for checking if the sidebar is open.
 * @returns {JSX.Element} The rendered profile icon.
 */
const ProfileIcon = ({ user, isSidebarOpen, onSignOut, size = 60, username = true, bgColor = "bg-color-color-4" }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleIconClick = () => {
    if (!isSidebarOpen) {
      setIsDropdownOpen(!isDropdownOpen);
    } else if (isSidebarOpen && isDropdownOpen) {
      setIsDropdownOpen(false);
    }
  };

  const handleSignOut = () => {
    onSignOut(); // Trigger the sign-out process
  };

  return (
    <div className="relative">
      <div
        className={classNames("flex items-center cursor-pointer", `${bgColor}`)}
        onClick={handleIconClick}
      >
        <div
          className="flex items-center justify-center rounded-full overflow-hidden leading-4"
          style={{ width: size, height: size }}
        >
          <img
            src={user.picture}
            alt="Profile"
            className="w-full h-full object-cover"
            style={{ borderRadius: "50%" }}
          />
        </div>
        {username && (
          <span className="ml-2 text-sm text-gray-700">
            {user.username}
          </span>
        )}
      </div>

      {isDropdownOpen && (
        <div 
          className="absolute left-0 my-3 w-32 bg-white border border-gray-300 rounded-lg shadow-lg z-50" 
          style={{ bottom: '100%', right: 0 }} // Adjust these values as necessary
        >
          <div className="p-2 text-gray-700 hover:bg-gray-100 w-full cursor-pointer" onClick={handleSignOut}>
            <span className="flex items-center">
              Sign Out
              <LogOut className="w-5 h-5 ml-2" />
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

// Prop types for validation
ProfileIcon.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  onSignOut: PropTypes.func, // PropType for the onSignOut function
  size: PropTypes.number,
  username: PropTypes.bool,
  bgColor: PropTypes.string, // Ensure bgColor is a string
  isSidebarOpen: PropTypes.bool.isRequired, // PropType for the isSidebarOpen boolean
};

export default ProfileIcon;
