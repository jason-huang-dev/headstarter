import React from "react";
import PropTypes from "prop-types";
import { X } from "lucide-react";

/**
 * Popup component that provides a modal for displaying content in a centered popup.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {boolean} props.isOpen - Indicates if the popup is open.
 * @param {Function} props.onClose - Function to close the popup.
 * @param {string} props.title - The title of the Popup.
 * @param {React.ReactNode} props.children - The content to display inside the Popup.
 * @returns {JSX.Element} The Popup component.
 */

export const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-lg p-6 relative">
        <div className="flex justify-between items-center mb-4">
          {/* Close button */}
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            <X /> {/* Close icon */}
          </button>
          {/* Display title if provided */}
          {title && <h2 className="text-lg font-sora font-bold">{title}</h2>}
        </div>

        {/* Main content area to display children */}
        <div className="overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

// Define PropTypes for the Popup component to ensure correct prop types
Popup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};
