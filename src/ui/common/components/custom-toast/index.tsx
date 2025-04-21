import React from 'react';
import Link from 'next/link';
import { LiaCartPlusSolid } from 'react-icons/lia';
import { IoMdCheckmarkCircle } from 'react-icons/io';
import { IoCloseCircle } from 'react-icons/io5';

interface CustomToastProps {
  message: string;
  actionLink?: string;
  actionText?: string;
  type?: 'success' | 'error' | 'info';
  onClose?: () => void;
}

const CustomToast: React.FC<CustomToastProps> = ({
  message,
  actionLink,
  actionText = 'View Cart',
  type = 'success',
  onClose,
}) => {
  // Determine icon based on type
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <IoMdCheckmarkCircle className="text-green-500" size={20} />;
      case 'error':
        return <IoCloseCircle className="text-red-500" size={20} />;
      default:
        return <LiaCartPlusSolid className="text-primary-500" size={20} />;
    }
  };

  // Determine background color based on type
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-gray-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <div className={`flex items-center justify-between border rounded-lg p-3 ${getBgColor()}`}>
      <div className="flex items-center">
        <div className="mr-3">{getIcon()}</div>
        <p className="text-sm font-medium">{message}</p>
      </div>
      
      <div className="flex items-center gap-2">
        {actionLink && (
          <Link 
            href={actionLink} 
            className="ml-4 text-sm font-medium text-primary-600 hover:text-primary-800 whitespace-nowrap underline"
            onClick={onClose}
          >
            {actionText}
          </Link>
        )}
        
        {onClose && (
          <button
            onClick={onClose}
            className="ml-1 text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomToast;