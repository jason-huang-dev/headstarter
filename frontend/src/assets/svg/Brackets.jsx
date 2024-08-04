/**
 * Brackets component that renders an SVG element representing brackets on either the left or right side.
 * 
 * This component:
 * - Renders an SVG graphic with a gradient stroke based on the `position` prop.
 * - Displays the brackets in a vertical orientation.
 * - Uses a gradient fill for the stroke of the brackets.
 * 
 * @component
 * @param {string} position - Determines the position of the brackets. Can be "left" or "right".
 * @returns {JSX.Element} The rendered SVG element for the brackets.
 */
const Brackets = (position) =>
  position === "left" ? (
    <svg
      width="5"
      height="14"
      viewBox="0 0 5 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M5 0.822266H1V12.8223H5" stroke="url(#brackets-left)" />
      <defs>
        <linearGradient id="brackets-left" x1="50%" x2="50%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#89F9E8" />
          <stop offset="100%" stopColor="#FACB7B" />
        </linearGradient>
      </defs>
    </svg>
  ) : (
    <svg
      width="5"
      height="14"
      viewBox="0 0 5 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M-2.98023e-08 0.822266H4V12.8223H-2.98023e-08"
        stroke="url(#brackets-right)"
      />
      <defs>
        <linearGradient
          id="brackets-right"
          x1="14.635%"
          x2="14.635%"
          y1="0%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#9099FC" />
          <stop offset="100%" stopColor="#D87CEE" />
        </linearGradient>
      </defs>
    </svg>
  );

export default Brackets;
