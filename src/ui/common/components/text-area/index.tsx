import React, { forwardRef, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  id: string;
  className?: string;
  error?: string; // Error message support
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, id, className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col w-full">
        {label && (
          <label
            htmlFor={id}
            className={clsx(
              "mb-2 text-sm font-medium",
              error ? "text-red-600" : "text-gray-600"
            )}
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={clsx(
            "border rounded-md p-2 w-full resize-none transition-all focus:ring-2",
            error
              ? "border-red-500 focus:ring-red-500"
              : "border-gray-300 focus:ring-blue-500 focus:border-blue-500",
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
      </div>
    );
  }
);

TextArea.displayName = "TextArea";

export default TextArea;
