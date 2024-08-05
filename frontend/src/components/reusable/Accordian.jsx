'use client'
import React from "react";
import { ChevronDown, ChevronLeft } from "lucide-react";

/**
 * Accordion component representing a single item in the accordion.
 *
 * @component
 * @param {Object} props - React props
 * @param {string} props.title - Title of the accordion item
 * @param {boolean} props.isActive - Whether the accordion item is active
 * @param {string} [props.icon = null] - URL for the icon image, default is null
 * @param {number} [props.iconSize = 40] - Size of the icon as a number 
 * @param {boolean} [props.displayTitle = true] - Whether to render the title, default is true
 * @param {function} props.onTitleClick - Function to handle title click event
 * @param {React.ReactNode} props.children - Content to be displayed within the item
 * @returns {JSX.Element} AccordionItem component
 */
const Accordion = ({ title, isActive, onTitleClick, children, displayTitle = true, icon: Icon = null, iconSize = 40 }) => {
    return (
        <div className={`accordion-item ${isActive ? 'active' : ''}`}>
            <div 
                className={`accordion-title flex items-center justify-between ${(isActive && displayTitle) ? 'text-blue-600' : 'text-gray-700'}`} 
                onClick={() => {
                    console.log('Title clicked'); // Debug statement
                    onTitleClick(); // Ensure click handler is called
                  }}
            >
                <div className="flex items-center">
                    {Icon && (
                        <div
                            className="flex items-center justify-center overflow-hidden leading-4"
                            style={{ width: iconSize, height: iconSize }}
                        >
                            <Icon className="w-full h-full" />
                        </div>
                    )}
                    {displayTitle && title && (
                        <span className="ml-2 text-sm">
                            {title}
                        </span>
                    )}
                </div>
                {displayTitle && isActive ? <ChevronDown/>:''}
                {displayTitle && !isActive ? <ChevronLeft/>:''}
            </div>
            {(isActive && displayTitle) && <div className="accordion-content">{children}</div>}
        </div>
    );
};

export default Accordion;
