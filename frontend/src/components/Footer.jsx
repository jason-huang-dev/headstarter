import React from "react";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <div className="lg:pb-16 xl:pb-20 lg:pb-32 xl:pb-20 !px-0">
    <div className="container flex sm:justify-between justify-center items-center gap-10 max-sm:flex-col mb-10 sm:mb-8 lg:mb-4">
        <p className="caption text-n-4 lg:block">
            © {new Date().getFullYear()}. All rights reserved.
        </p>

        <h4 className="flex gap-5 flex-wrap">
            <Link to="/team" className="text-green-700 underline">
                HeadStarter Group Team
            </Link>
        </h4>
    </div>
</div>
  );
};

export default Footer;