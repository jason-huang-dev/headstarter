'use client'
import React, {useContext, createContext, useState} from "react";
import PropTypes from "prop-types";
import { MenuSvg } from "../../assets/svg";
import { Button, ProfileIcon } from "../reusable";
import { iconsite} from "../../assets/png";
import { ChevronFirst, ChevronLast, MoreVertical } from "lucide-react";

const SidebarContext = createContext()

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
        <aside
            className={`h-screen transition-width duration-300 ease-in-out ${
            isOpen ? "w-64" : "w-20"
            }`}
        >
            <nav className="h-full flex flex-col bg-white border-r shadow-sm">
                <div className="p-4 pb-2 flex justify-between items-center">
                    <img
                    src={iconsite}
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                        isOpen ? "w-[45px]" : "w-0"
                    }`}
                    alt="Logo"
                    />
                    <button
                    onClick={() => setIsOpen((curr) => !curr)}
                    className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100"
                    >
                    {isOpen ? <ChevronFirst /> : <ChevronLast />}
                    </button>
                </div>
                
                <SidebarContext.Provider value={{ isOpen }}>
                    <ul className="flex-1 px-3">{children({isOpen})}</ul>
                </SidebarContext.Provider>
        
                <div className="border-t flex p-3 items-center">
                    <ProfileIcon user={user} size={40} username={isOpen}></ProfileIcon>
                    {isOpen && <MoreVertical size={30} />}
                </div>
            </nav>
        </aside> 
    );
};

function SideBarItem({icon, text, active, alert}) {
    const { isOpen } = useContext(SidebarContext);

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
        <span
            className={`overflow-hidden transition-all ${
            isOpen ? "w-52 ml-3" : "w-0"
            }`}
        >
            {text}
        </span>
        {alert && (
            <div
            className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
                isOpen ? "" : "top-2"
            }`}
            />
        )}

        {!isOpen && (
            <div
            className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-indigo-100 text-indigo-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
            >
            {text}
            </div>
        )}
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

export {SideBar, SideBarItem}