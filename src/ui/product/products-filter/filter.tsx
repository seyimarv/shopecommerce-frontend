"use client";

import { Checkbox } from "@/ui/common/components/checkbox";
import { Filter } from "@/ui/common/components/Filter";
import CurrencyInput from "@/ui/common/components/input/currency-input";

type AvailabilityFilterProps = {
  selectedAvailability: string[];
  onAvailabilityChange: (availability: string[]) => void;
  inStockCount: number;
  outOfStockCount: number;
}

export const AvailabiltyFilter = ({
  selectedAvailability,
  onAvailabilityChange,
  inStockCount,
  outOfStockCount
}: AvailabilityFilterProps) => {
  const handleChange = (value: string) => {
    if (selectedAvailability.includes(value)) {
      onAvailabilityChange(selectedAvailability.filter(v => v !== value));
    } else {
      onAvailabilityChange([...selectedAvailability, value]);
    }
  };

  return (
    <Filter 
      label="Availabitility" 
      headerText={`${selectedAvailability.length} selected`}
      reset={() => onAvailabilityChange([])}
    >
      <Checkbox 
        label={`In stock (${inStockCount})`}
        checked={selectedAvailability.includes('in-stock')}
        onChange={() => handleChange('in-stock')}
      />
      <Checkbox 
        label={`Out of stock (${outOfStockCount})`}
        className="mt-4"
        checked={selectedAvailability.includes('out-of-stock')}
        onChange={() => handleChange('out-of-stock')}
      />
    </Filter>
  );
};

type PriceFilterProps = {
  minPrice: number | null;
  maxPrice: number | null;
  onPriceChange: (min: number | null, max: number | null) => void;
}

export const PriceFilter = ({
  minPrice,
  maxPrice,
  onPriceChange
}: PriceFilterProps) => {
  return (
    <Filter 
      label="Price" 
      headerText={minPrice || maxPrice ? `$${minPrice || 0} - $${maxPrice || '∞'}` : 'Price'}
      reset={() => onPriceChange(null, null)}
    >
      <div className="flex gap-4">
        <CurrencyInput 
          placeholder="From"
          value={minPrice ?? ''}
          onChange={(e) => onPriceChange(Number(e.target.value), maxPrice)}
        />
        <CurrencyInput 
          placeholder="To"
          value={maxPrice ?? ''}
          onChange={(e) => onPriceChange(minPrice, Number(e.target.value))}
        />
      </div>
    </Filter>
  );
};
