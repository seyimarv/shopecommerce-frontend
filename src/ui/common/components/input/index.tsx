/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { forwardRef, useState, InputHTMLAttributes, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils/cn";

const inputVariants = cva(
  "w-full rounded-xl border bg-transparent px-3 py-2 text-sm transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border-gray-300 focus:border-gray-900",
        error: "border-red-500 text-red-500 focus:border-red-500 focus:ring-red-500",
      },
      size: {
        default: "h-10 text-base",
        sm: "h-8 px-2 text-xs",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

// Define wrapper variants
const wrapperVariants = cva(
  "relative w-full flex flex-col",
  {
    variants: {
      spacing: {
        default: "gap-1.5",
        tight: "gap-1",
        relaxed: "gap-2",
      },
    },
    defaultVariants: {
      spacing: "default",
    },
  }
);

export interface InputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">, 
    VariantProps<typeof inputVariants>,
    VariantProps<typeof wrapperVariants> {
  label?: string;
  helperText?: string;
  errorMessage?: string;
  startContent?: ReactNode;
  endContent?: ReactNode;
  isRequired?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputWrapperClassName?: string;
  helperTextClassName?: string;
  errorClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type = "text",
      variant = "default",
      size = "default",
      spacing = "default",
      label,
      helperText,
      errorMessage,
      startContent,
      endContent,
      isRequired = false,
      containerClassName,
      labelClassName,
      inputWrapperClassName,
      helperTextClassName,
      errorClassName,
      id,
      disabled,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const hasError = !!errorMessage;

    return (
      <div className={cn(wrapperVariants({ spacing }), containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "text-sm font-medium text-gray-700 flex items-center gap-1",
              hasError && "text-red-500",
              labelClassName
            )}
          >
            {label}
            {isRequired && <span className="text-red-500">*</span>}
          </label>
        )}
        
        <div
          className={cn(
            "relative flex items-center",
            inputWrapperClassName
          )}
        >
          {startContent && (
            <div className="absolute left-2 flex items-center pointer-events-none">
              {startContent}
            </div>
          )}
          
          <input
            type={type}
            id={inputId}
            ref={ref}
            disabled={disabled}
            className={cn(
              inputVariants({
                variant: hasError ? "error" : "default",
                size,
              }),
              startContent && "pl-9",
              endContent && "pr-9",
              className
            )}
            aria-invalid={hasError}
            aria-describedby={
              hasError
                ? `${inputId}-error`
                : helperText
                ? `${inputId}-description`
                : undefined
            }
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {endContent && (
            <div className="absolute right-2 flex items-center">
              {endContent}
            </div>
          )}
        </div>
        
        {helperText && !hasError && (
          <p
            id={`${inputId}-description`}
            className={cn(
              "text-xs text-gray-500",
              helperTextClassName
            )}
          >
            {helperText}
          </p>
        )}
        
        {hasError && (
          <p
            id={`${inputId}-error`}
            className={cn(
              "text-xs text-red-500",
              errorClassName
            )}
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export { Input };