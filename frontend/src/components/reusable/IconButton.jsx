import React from 'react';

/**
 * IconButton component
 * A customizable button with an icon and a tooltip.
 * 
 * @param {React.ElementType} icon - The icon to display inside the button.
 * @param {string} tooltip - The text to display in the tooltip.
 * @param {function} onClick - Function to call when the button is clicked.
 * @param {string} [className] - Additional classes for button customization.
 * @param {number} [size=30] - The size of the icon (width and height).
 */
const IconButton = ({ icon: Icon, tooltip, onClick, className = '', size = 30 }) => {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`py-2 rounded-lg transition-colors duration-200 ${className}`}
      >
        {/* Render the passed icon with customizable size */}
        <Icon style={{ width: `${size}px`, height: `${size}px` }} />
      </button>

      {/* Tooltip */}
      <span className="absolute z-50 bottom-full left-1/2 overflow-x-visible -translate-x-1/2 mb-2 w-max px-2 py-1 text-sm text-white bg-black rounded opacity-0 group-hover:opacity-100 transition-opacity duration-100">
        {tooltip}
      </span>
    </div>
  );
};

export default IconButton;
