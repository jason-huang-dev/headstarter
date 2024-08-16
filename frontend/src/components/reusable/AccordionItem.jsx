import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';

/**
 * AccordionItem component that represents an individual item within an accordion list.
 *
 * This component displays an icon and a link with a title. When the item is clicked,
 * it toggles its open state and calls an external click handler. The icon and title
 * are grey by default and turn black on hover. The component also shows a chevron
 * icon indicating its state (open or closed).
 *
 * @component
 * @param {Object} props - The component props.
 * @param {string} props.title - The title of the accordion item.
 * @param {React.ElementType} props.IconComponent - The icon component to be displayed.
 * @param {boolean} props.displayTitle - Whether to display the title.
 * @param {boolean} props.isActive - The initial active state of the accordion item.
 * @param {Function} props.onTitleClick - Function to be called when the title is clicked.
 * @param {string} props.link - The URL to link to when the title is clicked.
 * @param {React.ReactNode} props.children - The children components to be displayed when the accordion item is open.
 * @returns {JSX.Element} The rendered AccordionItem component.
 */

const AccordionItem = ({ title, IconComponent, displayTitle, isActive, onTitleClick, link }) => {
    const [isOpen, setIsOpen] = useState(isActive);

    /**
     * Handles the toggle of the accordion item.
     */
    const handleToggle = () => {
        setIsOpen(!isOpen);
        onTitleClick();
    };

    return (
    <div className="accordion-item">
        <div className="flex justify-between cursor-pointer ml-5 p-3" onClick={handleToggle}>
            <div className="flex items-center text-gray-400 hover:text-black transition-colors">
                {IconComponent && <IconComponent className={`w-6 h-6 ${!displayTitle ? 'mr-0' : 'mr-1'}`} />}
                {displayTitle && link ? (
                    <Link to={link} className="text-sm ml-1 hover:font-semibold hover:text-black transition-colors">
                        {title}
                    </Link>
                ) : (
                    <span className="text-sm ml-1">
                        {title}
                    </span>
                )}
            </div>
            {isActive && <Eye color="#7ADB78" className={`w-6 h-6 ${!displayTitle ? 'mr-0' : 'mr-1'}`} />}
        </div>
    </div>
    );
};

AccordionItem.propTypes = {
    title: PropTypes.string.isRequired,
    IconComponent: PropTypes.elementType, // Use PropTypes.elementType for components
    displayTitle: PropTypes.bool,
    isActive: PropTypes.bool,
    onTitleClick: PropTypes.func.isRequired,
    link: PropTypes.string,
    children: PropTypes.node,
};

export default AccordionItem;
