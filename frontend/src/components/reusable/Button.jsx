// Button component, reusable

import React from 'react';

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
