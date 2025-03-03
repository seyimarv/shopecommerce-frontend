"use client";

import React, { forwardRef } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { Input, InputProps } from ".";

const SearchInput = forwardRef<HTMLInputElement, InputProps>(
  ({ value, onChange, ...props }, ref) => {
    return (
      <Input
        ref={ref}
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Search..."
        startContent={<FaSearch size={16} className="text-gray-500" />}
        endContent={
          <button
            type="button"
            onClick={() =>
              onChange &&
              (onChange as React.ChangeEventHandler<HTMLInputElement>)({
                target: { value: "" },
              } as React.ChangeEvent<HTMLInputElement>)
            }
            className="text-gray-500 hover:text-gray-700 transition cursor-pointer"
          >
            <FaTimes size={16} />
          </button>
        }
        {...props}
      />
    );
  }
);

SearchInput.displayName = "SearchInput";

export { SearchInput };
