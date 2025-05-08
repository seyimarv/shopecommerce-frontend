import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";
import Spinner from "../spinner";

interface DeleteButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick: () => void;
  size?: "small" | "medium" | "large";
  isLoading?: boolean;
  disabled?: boolean;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ 
  onClick, 
  size = "medium", 
  isLoading, 
  disabled = false, 
  className, 
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-100 cursor-pointer
        ${size === "small" ? "w-8 h-8" : size === "large" ? "w-12 h-12" : "w-10 h-10"} ${className}`}
      aria-label="Delete"
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Spinner />
      ) : (
        <RiDeleteBin5Line
          size={size === "small" ? 16 : size === "large" ? 24 : 20}
          fill="#4B5563" />
      )}
    </button>
  );
};

export default DeleteButton;
