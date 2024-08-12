import React from "react";

/**
 * Footer component that displays the footer section of the website.
 * 
 * This component renders a footer with:
 * - A copyright notice including the current year.
 * - A list of dev team members with their LinkedIn profiles.
 * 
 * @component
 * @returns {JSX.Element} The rendered Footer component.
 */
const Footer = () => {
  return (
    <div className="xl:pb-20 lg:pb-32 !px-0">
    <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col mb-10 sm:mb-8 lg:mb-4">
        <p className="caption text-n-4 lg:block">
            © {new Date().getFullYear()}. All rights reserved.
        </p>

        <h4 className="flex flex-wrap">
            Dev Team - 
            <a className="text-green-700 underline ml-2" target="_blank" href="https://www.linkedin.com/in/aisha-salimgereyeva/">Aisha</a>
            <span className="mr-2">,</span> 
            <a className="text-green-700 underline " target="_blank" href="https://www.linkedin.com/in/esterlin-jerez-paulino/">Esterlin</a>
            <span className="mr-2">,</span> 
            <a className="text-green-700 underline " target="_blank" href="https://www.linkedin.com/in/jasonhuangdev/">Jason</a>
            <span className="mr-2">,</span> 
            <a className="text-green-700 underline " target="_blank" href="https://www.linkedin.com/in/weijiew/">Weijie</a>
        </h4>

    </div>
</div>
  );
};

export default Footer;