import React, { useState } from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

/**
 * RightBar component that provides a right sidebar for adding any content passed as children.
 *
 * This component slides in from the right and displays the content passed to it as children.
 * The `rightBarTitle` prop is used to set the title of the sidebar.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isRightBarOpen - Indicates if the right sidebar is open.
 * @param {Function} props.setIsRightBarOpen - Function to set the visibility of the right sidebar.
 * @param {string} props.rightBarTitle - The title of the RightBar.
 * @param {React.ReactNode} props.children - The content to display inside the RightBar.
 * @returns {JSX.Element} The RightBar component.
 */
export const RightBar = ({isRightBarOpen, setIsRightBarOpen, rightBarTitle, children}) => {

  return (
    <aside
      className={`fixed right-0 top-0 h-screen bg-white border-l shadow-sm transition-transform duration-300 ease-in-out w-80`}
      style={{ transform: isRightBarOpen ? 'translateX(0)' : 'translateX(100%)' }}
    >
      <nav className="h-full flex flex-col overflow-x-hidden">
        {/* Header of the RightBar with a close button and title */}
        <div className="p-4 pb-2 flex justify-between items-center">
          <button
            onClick={() => setIsRightBarOpen(false)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <X /> {/* Close icon */}
          </button>
          <div className="flex justify-between items-center">
            {/* Display title if provided */}
            {rightBarTitle && <h2 className="mr-10 text-lg font-sora font-bold">{rightBarTitle}</h2>}
          </div>
        </div>

        {/* Main content area to display children */}
        <div className="p-4">
          {children}
        </div>
      </nav>
    </aside>
  );
};

// Define PropTypes for the RightBar component to ensure correct prop types
RightBar.propTypes = {
  isRightBarOpen: PropTypes.bool.isRequired, // Boolean to indicate if the right sidebar is open
  setIsRightBarOpen: PropTypes.func.isRequired, // Function to toggle the visibility of the sidebar
  rightBarTitle: PropTypes.string, // Title to display in the RightBar header
  children: PropTypes.node.isRequired, // Content to display inside the RightBar
};
