"use client";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Option,
} from "@/ui/common/components/Select";
import { countries } from "@/lib/utils/countries";

type CountrySelectProps = {
  name?: string;
  value?: string;
  onChange?: (option: Option) => void;
  className?: string;
};

const CountrySelect = ({ onChange, value, className }: CountrySelectProps) => {
  // Convert string value to Option object if it exists
  const selectedOption = value
    ? {
        value: value.toUpperCase(),
        label:
          countries.find((c) => c.value.toUpperCase() === value.toUpperCase())
            ?.label || value,
      }
    : undefined;

  return (
    <Select value={selectedOption} onChange={onChange}>
      <SelectTrigger
        className={`!text-sm !border-gray-300 !w-[100%] ${className || ""}`}
      />
      <SelectContent className="bg-white shadow-md rounded-none mt-1 !w-[100%] max-h-[200px] overflow-y-scroll">
        {countries.map((option) => (
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
