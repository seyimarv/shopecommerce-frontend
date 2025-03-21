"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Option,
} from "@/ui/common/components/Select";
import { useState } from "react";

export const sortingOptions = [
  { value: "nigeria", label: "Nigeria" },
  { value: "australia", label: "Australia" },
  { value: "canada", label: "Canada" },
];

type SortByProps = {
  name?: string;
  value?: string;
  onChange?: (option: Option) => void;
  className?: string;
};

const CountrySelect = ({ onChange }: SortByProps) => {
  const [value, setValue] = useState<Option | undefined>(sortingOptions[0]);
  return (
    <Select value={value} onChange={onChange}>
      <SelectTrigger className="!text-sm !border-gray-300 !w-[1/2]" />
      <SelectContent className="bg-white shadow-md rounded-none mt-1 ">
        {sortingOptions.map((option) => (
          <SelectItem
            key={option.value}
            value={option.value}
            label={option.label}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CountrySelect;
