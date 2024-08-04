import React, { useEffect, useState } from 'react';
import { MouseParallax } from 'react-just-parallax';

/**
 * Circles component that renders a series of moving colored circles with parallax effect.
 * 
 * @component
 * @param {Object} props - The props object.
 * @param {React.RefObject} props.parallaxRef - Reference to the parallax container for the MouseParallax component.
 * @returns {JSX.Element} The rendered circles with parallax effect.
 */
const CirclesSignIn = ({ parallaxRef }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <MouseParallax strength={0.07} parallaxContainerRef={parallaxRef}>
      <div className="absolute bottom-1/2 left-1/2 w-0.25 h-1/2 origin-bottom rotate-[46deg]">
        <div
          className={`w-2 h-2 -ml-1 -mt-89 bg-gradient-to-b from-[#DD734F] to-[#e3e3e3] rounded-full transition-transform duration-500 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        />
      </div>

      <div className="absolute bottom-1/2 left-1/2 w-0.25 h-1/2 origin-bottom -rotate-[56deg]">
        <div
          className={`w-4 h-4 -ml-1 -mt-32 bg-gradient-to-b from-[#DD734F] to-[#e3e3e3] rounded-full transition-transform duration-500 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        />
      </div>

      <div className="absolute bottom-1/2 left-1/2 w-0.25 h-1/2 origin-bottom rotate-[54deg]">
        <div
          className={`hidden w-4 h-4 -ml-4 mt-[10rem] bg-gradient-to-b from-[#B9AEDF] to-[#e3e3e3] rounded-full xl:block transit transition-transform duration-500 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        />
      </div>

      <div className="absolute bottom-1/2 left-1/2 w-0.25 h-1/2 origin-bottom -rotate-[65deg]">
        <div
          className={`w-3 h-3 -ml-1.5 mt-20 bg-gradient-to-b from-[#B9AEDF] to-[#e3e3e3] rounded-full transition-transform duration-500 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        />
      </div>

      <div className="absolute bottom-1/2 left-1/2 w-0.25 h-1/2 origin-bottom -rotate-[85deg]">
        <div
          className={`w-6 h-6 -ml-3 -mt-40 bg-gradient-to-b from-[#88E5BE] to-[#e3e3e3] rounded-full transition-transform duration-500 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        />
      </div>

      <div className="absolute bottom-1/2 left-1/2 w-0.25 h-1/2 origin-bottom rotate-[70deg]">
        <div
          className={`w-6 h-6 -ml-0 -mt-10 bg-gradient-to-b from-[#88E5BE] to-[#e3e3e3] rounded-full transition-transform duration-500 ease-out ${
            mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        />
      </div>
    </MouseParallax>
  );
};

export default CirclesSignIn;
