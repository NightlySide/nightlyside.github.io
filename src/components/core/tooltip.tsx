import React from "react";

interface TooltipProps {
  children: any;
  tooltipText: string;
}

const Tooltip = ({ children, tooltipText }: TooltipProps) => {
  const tipRef = React.createRef<HTMLDivElement>();

  const handleMouseEnter = () => {
    if (tipRef.current) {
      tipRef.current.style.opacity = "1";
      tipRef.current.style.marginLeft = "20px";
    }
  };
  const handleMouseLeave = () => {
    if (tipRef.current) {
      tipRef.current.style.opacity = "0";
      tipRef.current.style.marginLeft = "10px";
    }
  };

  return (
    <div className="relative flex items-center" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div
        className="hidden md:flex absolute whitespace-no-wrap bg-navbar text-white px-4 py-2 rounded items-center transition-all duration-150"
        style={{ left: "100%", opacity: 0 }}
        ref={tipRef}>
        {tooltipText}
      </div>
      {children}
    </div>
  );
};

export default Tooltip;
