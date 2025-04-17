import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

interface DeleteButtonProps {
  onClick: () => void;
  size?: "small" | "medium" | "large";
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick, size = "medium" }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-100 cursor-pointer
        ${size === "small" ? "w-8 h-8" : size === "large" ? "w-12 h-12" : "w-10 h-10"}`}
      aria-label="Delete"
    >
      <RiDeleteBin5Line 
        size={size === "small" ? 16 : size === "large" ? 24 : 20} 
        fill="#4B5563" />
    </button>
  );
};

export default DeleteButton;
