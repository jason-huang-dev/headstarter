import React, { useState } from 'react';
import { MoreVertical, LogOut } from 'lucide-react'; // LogOut is an example icon

/**
 * 
 * @param {Function} onSignOut - the function to handle user sign out
 * @returns a menu in the form of a MoreVerical Icon
 */
const ProfileMenu = ({ onSignOut }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleMoreClick = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSignOut = () => {
    onSignOut(); // Trigger the sign-out process
  };

  return (
    <div className="relative ml-auto">
      <>
        <MoreVertical 
          size={30} 
          className="cursor-pointer ml-auto" 
          onClick={handleMoreClick} 
        />
        {isDropdownOpen && (
          <div className="absolute right-0 bottom-full mb-2 w-48 bg-white border border-gray-300 rounded-lg shadow-lg">
            <button 
              onClick={handleSignOut} 
              className="flex items-center p-2 text-gray-700 hover:bg-gray-100 w-full"
            >
              Sign Out
              <LogOut className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}
      </>
    </div>
  );
};

export default ProfileMenu;
