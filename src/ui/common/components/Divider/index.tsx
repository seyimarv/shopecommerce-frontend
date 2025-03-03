import React from "react";

interface DividerProps {
  className?: string;
}

const Divider: React.FC<DividerProps> = ({ className = "" }) => {
  return <div className={`flex-grow border-t border-gray-400 ${className}`} />;
};

export default Divider;
