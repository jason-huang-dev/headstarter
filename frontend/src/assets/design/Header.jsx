/**
 * HamburgerMenu component that displays a hamburger menu background with animated elements.
 * 
 * This component:
 * - Renders a full-screen overlay with hidden background image (commented out).
 * - Includes animated rings, side lines, and background circles.
 * 
 * @component
 * @returns {JSX.Element} The rendered hamburger menu background with animated elements.
 */
export const HamburgerMenu = () => {
  return (
    <div className="absolute inset-0 pointer-events-none lg:hidden">
      <div className="absolute inset-0 opacity-[.03]">
        {/* <img
          className="w-full h-full object-cover"
          // src={background}
          width={688}
          height={953}
          alt="Background"
        /> */}
      </div>

      <Rings />

      <SideLines />

      <BackgroundCircles />
    </div>
  );
};

// Ensure other exports are correctly named
/**
 * Rings component that renders concentric circular rings in the background.
 * 
 * This component:
 * - Displays a series of concentric rings with borders.
 * 
 * @component
 * @returns {JSX.Element} The rendered concentric rings.
 */
export const Rings = () => {
  return (
    <div className="absolute top-1/2 left-1/2 w-[51.375rem] aspect-square border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2">
      <div className="absolute top-1/2 left-1/2 w-[36.125rem] aspect-square border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute top-1/2 left-1/2 w-[23.125rem] aspect-square border border-n-2/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
    </div>
  );
};

/**
 * SideLines component that renders vertical lines on the left and right edges.
 * 
 * This component:
 * - Displays two vertical lines positioned on the left and right sides of the screen.
 * 
 * @component
 * @returns {JSX.Element} The rendered vertical side lines.
 */
export const SideLines = () => {
  return (
    <>
      <div className="absolute top-0 left-5 w-0.25 h-full bg-n-6"></div>
      <div className="absolute top-0 right-5 w-0.25 h-full bg-n-6"></div>
    </>
  );
};

/**
 * BackgroundCircles component that renders circular elements with gradients.
 * 
 * This component:
 * - Displays multiple circular elements with gradient backgrounds at specified positions.
 * 
 * @component
 * @returns {JSX.Element} The rendered background circles with gradient fills.
 */
export const BackgroundCircles = () => {
  return (
    <>
      <div className="absolute top-[4.4rem] left-16 w-3 h-3 bg-gradient-to-b from-[#DD734F] to-[#1A1A32] rounded-full"></div>
      <div className="absolute top-[12.6rem] right-16 w-3 h-3 bg-gradient-to-b from-[#B9AEDF] to-[#1A1A32] rounded-full"></div>
      <div className="absolute top-[26.8rem] left-12 w-6 h-6 bg-gradient-to-b from-[#88E5BE] to-[#1A1A32] rounded-full"></div>
    </>
  );
};

