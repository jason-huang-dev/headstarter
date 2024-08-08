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
const Accordion = ({ title, isActive, onTitleClick, children, displayTitle = true, icon: Icon = null }) => {
    return (
    <div className={`relative flex flex-col py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group hover:bg-gray-100 ${isActive ? 'bg-gray-100' : ''}`}>
        <div 
            className={`accordion-title flex items-center justify-between w-full ${displayTitle ? '' : 'justify-center'}`} 
            onClick={onTitleClick}
        >
            <div className={`flex items-center ${displayTitle ? '' : 'justify-center w-full'}`}>
                {Icon && (
                    <div className="flex items-center justify-center leading-4">
                        <Icon style={{ width: '32px', height: '32px' }} />
                    </div>
                )}
                {displayTitle && title && (
                    <span className="ml-2 text-sm">
                        {title}
                    </span>
                )}
            </div>
            {displayTitle && isActive ? <ChevronDown /> : ''}
            {displayTitle && !isActive ? <ChevronLeft /> : ''}
        </div>
        {(isActive && displayTitle) && <div className="accordion-content">{children}</div>}
    </div>
    );
};


export default Accordion;
