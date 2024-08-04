'use client'
import React, {useState} from "react";
import PropTypes from "prop-types";
import { MenuSvg } from "../../assets/svg";
import { Button, ProfileIcon } from "../reusable";
import { iconsite} from "../../assets/png";
import './Drawer.css';
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";

/**
 * Drawer component that provides a sidebar navigation.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object containing user data.
 * @param {string} props.user.username - The username of the user.
 * @param {string} props.user.picture - The profile picture URL of the user.
 * @returns {JSX.Element} The Drawer component.
 */
const SideBar = ({ user, children }) => {
    const [isOpen, setIsOpen] = useState(true);
    
    return (
        <aside className="h-screen">
            <nav className="h-full inline-flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                        src={iconsite}
                        className={`overflow-hidden transition-all ${
                        isOpen ? "w-16" : "w-0"
                        }`}
                        alt=""
                    />
                    <button
                        onClick={() => setIsOpen((curr) => !curr)}
                        className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                        {isOpen ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>
                
                <ul className="flex-1 px-3"> {children} </ul>

                <div className="boarder-t flex p-3 items-center">
                    <ProfileIcon user={user} size={40} username={isOpen}></ProfileIcon>
                    {isOpen && <MoreVertical size={30}/>}
                </div>
            </nav>
        </aside>
    );
};

export function SideBarItem({icon, text, active, alert}) {
    return (
        <li
            className={`
                relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors group
                ${
                active
                    ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
                    : "hover:bg-indigo-50 text-gray-600"
                }
            `}
        >
        {icon}
        
        </li>
    )
}

// Prop types for validation
SideBar.propTypes = {
    user: PropTypes.shape({
      username: PropTypes.string.isRequired,
      picture: PropTypes.string.isRequired,
    }).isRequired,
  };

export default SideBar;