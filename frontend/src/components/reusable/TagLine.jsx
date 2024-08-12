import {Brackets} from "../../assets/svg";

/**
 * TagLine component that displays a styled tagline with decorative brackets.
 * 
 * This component includes:
 * - Decorative brackets on either side of the tagline.
 * - The tagline text centered between the brackets.
 * - Hover effects that animate the brackets.
 * 
 * @component
 * @param {object} props - The props for the component.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the container.
 * @param {React.ReactNode} props.children - The content (tagline text) to be displayed between the brackets.
 * @returns {JSX.Element} The rendered TagLine component.
 */
const TagLine = ({ className, children }) => {
  return (
    <div className={`tagline flex items-center group ${className || ""}`}>
      <div className="transition-transform transform group-hover:-translate-x-2 duration-300">
        {Brackets("left")}
      </div>
      <div className="mx-3 text-n-5">{children}</div>
      <div className="transition-transform transform group-hover:translate-x-2 duration-300">
        {Brackets("right")}
      </div>
    </div>
  );
};

export default TagLine;
