// Responsible topbar component
'use client'
import { useLocation } from "react-router-dom";
import { disablePageScroll, enablePageScroll } from "scroll-lock";
import {iconsite} from "../../assets/png"; // logo of the website
import {Button} from "../reusable"; // Custom Button component
import {MenuSvg} from "../../assets/svg"; // Custom SVG component for the menu icon
import { useState } from "react";
import {navigation} from "../../constants/index";

/**
 * LandingNavigation component provides a responsive top navigation bar for the landing page.
 * 
 * This component:
 * - Displays a logo and site name.
 * - Includes navigation links that adjust visibility based on the screen size.
 * - Manages the state for a responsive navigation menu with scroll lock.
 * 
 * @component
 * @returns {JSX.Element} The rendered LandingNavigation component.
 */
const LandingNavigation = () => {
  // Get the current location path
  const pathname = useLocation();
 
  // State to handle the navigation menu toggle
  const [openNavigation, setOpenNavigation] = useState(false);

  // Function to toggle the navigation menu
  const toggleNavigation = () => {
    if (openNavigation) {
      setOpenNavigation(false);
      enablePageScroll(); // Enable page scroll when navigation is closed
    } else {
      setOpenNavigation(true);
      disablePageScroll(); // Disable page scroll when navigation is open
    }
  };

  // Function to handle link click
  const handleClick = () => {
    if (!openNavigation) return;

    enablePageScroll(); // Enable page scroll when link is clicked
    setOpenNavigation(false); // Close navigation menu when link is clicked
  };

  return (
    <>
      {/* Top bar container with fixed position and conditional classes */}
      <div
        className={`fixed top-0 left-0 w-full z-50 border-b border-green-700 ${
          openNavigation ? "bg-n-1 lg:backdrop-blur-sm" : "bg-n-1/90 lg:backdrop-blur-sm"
        }`}
      >
        {/* Inner container for centering and padding */}
        <div  className="flex items-center px-5 lg:px-7.5 xl:px-10 max-lg:pt-4">
          
          {/* HomePage link - site icon and text span */}
          <a className="flex items-center w-[12rem] xl:mr-8" href="/">
            <img src={iconsite} width={60} alt="turtle icon" className="mr-2" />
            <span className="font-bold font-grotest text-base md:text-lg lg:text-2xl">
              TimeMesh
            </span>
          </a>

          {/* Navigation links container */}
          <nav
            className={`${
              openNavigation ? "flex" : "hidden"
            } fixed top-[4.8rem] left-0 right-0 bottom-0 bg-white lg:static lg:flex lg:mx-auto lg:bg-transparent`}
          >
            <div className="relative py-4 z-2 flex flex-col items-center justify-center m-auto lg:flex-row">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  onClick={handleClick}
                  className={`block relative font-code text-md lg:text-sm uppercase text-black transition-colors ${
                    item.onlyMobile ? "lg:hidden" : ""
                  } px-6 py-6 md:py-8 lg:py-2.5 lg:px-4 lg:mx-1.5 ${
                    item.url === pathname.hash
                      ? "z-2 lg:text-black"
                      : "lg:text-black/50"
                  } lg:leading-5 xl:px-12 ${
                    openNavigation ? "hover:underline focus:underline" : ""
                  }`}
                >
                  {item.title}
                </a>
              ))}
            </div>
          </nav>

          {/* Sign in button, visible only on large screens */}
          <Button outlined className="hidden lg:flex" href="/signin">
            Sign in
          </Button>

          {/* Menu SVG for toggling navigation on smaller screens */}
          <MenuSvg toggleNavigation={toggleNavigation} openNavigation={openNavigation} />
        </div>
      </div>
    </>
  );
};

export default LandingNavigation;

