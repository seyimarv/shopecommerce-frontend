"use client";

import React, {
  forwardRef,
  InputHTMLAttributes,
  useEffect,
  useRef,
} from "react";
import { FaCheck, FaMinus } from "react-icons/fa";
import { cn } from "@/lib/utils/cn";

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label?: string;
  indeterminate?: boolean;
  error?: string;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    { className, label, indeterminate = false, error, id, disabled, ...props },
    ref
  ) => {
    const checkboxId =
      id || `checkbox-${Math.random().toString(36).substring(2, 9)}`;
    const internalRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
      if (internalRef.current) {
        internalRef.current.indeterminate = indeterminate;
      }
    }, [indeterminate]);

    const handleRef = (el: HTMLInputElement) => {
      internalRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    };

    return (
      <div className={cn("flex flex-col gap-1", className)}>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            id={checkboxId}
            ref={handleRef}
            disabled={disabled}
            className="hidden peer"
            aria-invalid={!!error}
            {...props}
          />
          <div
            className={cn(
              "w-5 h-5 flex items-center justify-center border rounded transition-all",
              props.checked || indeterminate
                ? "bg-blue-500 border-blue-500"
                : "border-gray-400",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            aria-hidden="true"
          >
            {props.checked && !indeterminate && (
              <FaCheck className="w-4 h-4 text-white" />
            )}
            {indeterminate && <FaMinus className="w-4 h-4 text-white" />}
          </div>
          {label && <span className="text-sm text-gray-700">{label}</span>}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
