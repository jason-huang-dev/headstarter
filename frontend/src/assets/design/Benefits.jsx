/**
 * GradientLight component that renders a radial gradient background.
 * 
 * This component:
 * - Displays a full-width square div with a radial gradient background.
 * - The gradient transitions from a solid color to transparent.
 * - Positioned at the top left with a 1/4 left offset.
 * 
 * @component
 * @returns {JSX.Element} The rendered div with radial gradient background.
 */
export const GradientLight = () => {
  return (
    <div className="absolute top-0 left-1/4 w-full aspect-square bg-radial-gradient from-[#28206C] to-[#28206C]/0 to-70% pointer-events-none" />
  );
};
