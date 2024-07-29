import React from 'react';
import Button from '../../components/Button';


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

