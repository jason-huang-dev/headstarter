// Button component, reusable

import React from 'react';

/**
 * Button component that can be used as either a link or a button.
 * 
 * This component includes:
 * - Styles for both default and outlined button variants.
 * - Support for focus ring color customization.
 * - Can be rendered as a link or a button based on the `href` prop.
 * 
 * @component
 * @param {object} props - The props for the component.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the button.
 * @param {string} [props.href] - Optional URL for the button to act as a link. If provided, the button will render as an `<a>` element.
 * @param {function} [props.onClick] - Optional click handler function. Used only if `href` is not provided.
 * @param {React.ReactNode} props.children - The content (text or elements) to be displayed inside the button.
 * @param {boolean} [props.outlined=false] - If true, renders the button in an outlined style; otherwise, renders the default filled style.
 * @param {string} [props.focusRingColor=""] - Optional additional CSS class for focus ring color.
 * @returns {JSX.Element} The rendered Button component.
 */
const Button = ({ className, href, onClick, children, outlined, focusRingColor = "" }) => {
  const spanClasses = "relative z-10";

  const baseClasses = `focus:outline-none font-medium rounded-lg px-5 py-3 me-2 mb-2 ${focusRingColor}`;
  const defaultClasses = "text-white bg-green-700 hover:bg-green-800 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800";
  const outlinedClasses = `text-green-700 bg-white border border-green-700 hover:bg-green-700 hover:text-white dark:text-green-600 dark:border-green-600 dark:hover:bg-green-700 dark:hover:text-white dark:focus:ring-green-800`;
  
  const commonClasses = `${baseClasses} ${outlined ? outlinedClasses : defaultClasses} ${className || ""}`;

  if (href) {
    return (
      <a href={href} className={commonClasses}>
        <span className={spanClasses}>{children}</span>
      </a>
    );
  }

  return (
    <button
      type="button"
      className={commonClasses}
      onClick={onClick}
    >
      <span className={spanClasses}>{children}</span>
    </button>
  );
};

export default Button;
