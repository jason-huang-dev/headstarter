import brackets from "../../assets/svg/Brackets";

const TagLine = ({ className, children }) => {
  return (
    <div className={`tagline flex items-center group ${className || ""}`}>
      <div className="transition-transform transform group-hover:-translate-x-2 duration-300">
        {brackets("left")}
      </div>
      <div className="mx-3 text-n-5">{children}</div>
      <div className="transition-transform transform group-hover:translate-x-2 duration-300">
        {brackets("right")}
      </div>
    </div>
  );
};

export default TagLine;
