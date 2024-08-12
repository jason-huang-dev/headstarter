import React from 'react';
import Button from '../../components/reusable/Button';

/**
 * MenuSvg component that provides a responsive menu button with a toggle animation.
 * 
 * This component:
 * - Renders a button that displays an SVG icon.
 * - The SVG icon changes appearance based on the `openNavigation` prop, indicating whether the menu is open or closed.
 * - Uses the `Button` component for styling and interaction.
 * 
 * @component
 * @param {object} props - The props for the component.
 * @param {boolean} props.openNavigation - Boolean indicating if the menu is currently open. This affects the SVG icon's appearance.
 * @param {function} props.toggleNavigation - Function to handle the button click event, typically used to open or close the navigation menu.
 * @returns {JSX.Element} The rendered MenuSvg component.
 */
const MenuSvg = ({ openNavigation, toggleNavigation }) => {
  return (
    <Button
      className="ml-auto lg:hidden hover-menu"
      outlined
      onClick={toggleNavigation}
    >
      <svg
        className="overflow-visible"
        width="20"
        height="20"
        viewBox="0 0 20 12"
      >
        <rect
          className="transition-all origin-center menu-rect"
          y={openNavigation ? "5" : "0"}
          width="20"
          height="2"
          rx="1"
          fill="rgb(21 128 61)"
          transform={`rotate(${openNavigation ? "45" : "0"})`}
        />
        <rect
          className="transition-all origin-center menu-rect"
          y={openNavigation ? "5" : "10"}
          width="20"
          height="2"
          rx="1"
          fill="rgb(21 128 61)"
          transform={`rotate(${openNavigation ? "-45" : "0"})`}
        />
      </svg>
    </Button>
  );
};

export default MenuSvg;

