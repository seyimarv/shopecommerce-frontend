"use client";

import { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  Option,
} from "@/ui/common/components/Select";

const sortingOptions = [
  { value: "featured", label: "Featured" },
  { value: "best-selling", label: "Best selling" },
  { value: "alpha-asc", label: "Alphabetically, A-Z" },
  { value: "alpha-desc", label: "Alphabetically, Z-A" },
  { value: "price-asc", label: "Price, low to high" },
  { value: "price-desc", label: "Price, high to low" },
  { value: "date-old", label: "Date, old to new" },
  { value: "date-new", label: "Date, new to old" },
];

const SortBy = () => {
  const [selectedSort, setSelectedSort] = useState<Option | undefined>(
    sortingOptions[0]
  );

  return (
    <Select value={selectedSort} onChange={setSelectedSort}>
      <SelectTrigger title="Sort by" className="!text-sm !w-[12.5rem]" />
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

export default SortBy;
