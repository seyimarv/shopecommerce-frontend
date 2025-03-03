"use client";

import { Checkbox } from "@/ui/common/components/checkbox";
import { Filter } from "@/ui/common/components/Filter";
import CurrencyInput from "@/ui/common/components/input/currency-input";

export const AvailabiltyFilter = () => {
  return (
    <Filter label="Availabitility" headerText="0 selected" reset={() => {}}>
      <Checkbox label=" In stock (445)" />
      <Checkbox label="Out of stock (40)" className="mt-4" />
    </Filter>
  );
};

export const PriceFilter = () => {
  return (
    <Filter label="Price" headerText="Price" reset={() => {}}>
      <div className="flex gap-4">
        <CurrencyInput placeholder="From" />
        <CurrencyInput placeholder="To" />
      </div>
    </Filter>
  );
};
