'use client'
import React, {useState} from "react";
import { MenuSvg } from "../../assets/svg";
import { Button } from "../reusable";
import './Drawer.css';

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
const Drawer = ({ user }) => {
    const [isOpen, setIsOpen] = useState(true);
    
    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div>
            <Button className="menu-button" onClick={toggleDrawer}>
                &times; {/* Close icon */}
            </Button>            
            <div className={`drawer ${isOpen ? 'open' : 'close'}`}>
                <Button className="close-button" onClick={toggleDrawer}>
                    &times; {/* Close icon */}
                </Button>
                {user ? (
                    <div>
                    <h2>Welcome, {user.username}</h2>
                    <img className='profile-icon' src={user.picture} alt="Profile" />
                    </div>
                ) : (
                    <p>No user data available</p>
                )}
            </div>
        </div>
    );
};

export default Drawer;