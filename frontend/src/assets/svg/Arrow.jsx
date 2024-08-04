/**
 * Arrow component that renders a right-pointing arrow icon.
 * 
 * This component:
 * - Displays an SVG graphic of an arrow pointing to the right.
 * - Uses a green color for the arrow stroke.
 * 
 * @component
 * @returns {JSX.Element} The rendered SVG element for the arrow icon.
 */
const Arrow = () => {
  return (
    <svg className="ml-5 " width="24" height="24">
      <path fill="rgb(21, 128, 61)" 
      d="M8.293 5.293a1 1 0 0 1 1.414 0l6 6a1 1 0 0 1 0 1.414l-6 6a1 1 0 0 1-1.414-1.414L13.586 12 8.293 6.707a1 1 0 0 1 0-1.414z" />
    </svg>
  );
};

export default Arrow;
