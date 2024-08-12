import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames"; // Optional, for conditional class names
import { MoreVertical } from "lucide-react";

/**
 * ProfileIcon component displays a user's profile icon and optionally their username.
 * 
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object containing user data.
 * @param {string} props.user.username - The username of the user.
 * @param {string} props.user.picture - The profile picture URL of the user.
 * @param {number} [props.size=60] - The size of the profile icon in pixels. Defaults to 60.
 * @param {boolean} [props.username=true] - Boolean for display of username. Defaults to true.
 * @param {string} [props.bgColor="n-1"] - Background color for the profile icon. Defaults to "n-1".
 * @returns {JSX.Element} The rendered profile icon.
 */
const ProfileIcon = ({ user, size = 60, username = true, bgColor = "bg-color-color-4" }) => {
  return (
    <div
      className={
        classNames(
        "flex items-center",
        `${bgColor}` // Use Tailwind color class
        )
    }>
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
    
  );
};

// Prop types for validation
ProfileIcon.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string.isRequired,
    picture: PropTypes.string.isRequired,
  }).isRequired,
  size: PropTypes.number,
  username: PropTypes.bool,
  bgColor: PropTypes.string, // Ensure bgColor is a string
};

export default ProfileIcon;
