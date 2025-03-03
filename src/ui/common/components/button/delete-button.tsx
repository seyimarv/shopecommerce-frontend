import React from "react";
import { RiDeleteBin5Line } from "react-icons/ri";

interface DeleteButtonProps {
  onClick: () => void;
}

const DeleteButton: React.FC<DeleteButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-sm hover:bg-gray-100 cursor-pointer"
      aria-label="Delete"
    >
      <RiDeleteBin5Line size={20} fill="#4B5563" />
    </button>
  );
};

export default DeleteButton;
