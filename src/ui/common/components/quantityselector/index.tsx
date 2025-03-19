"use client";

import { useCallback } from "react";

interface QuantityButtonProps {
  onClick: () => void;
  disabled: boolean;
  ariaLabel: string;
  children: React.ReactNode;
}

const QuantityButton: React.FC<QuantityButtonProps> = ({ onClick, disabled, ariaLabel, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={ariaLabel}
    className="w-7 h-7 flex items-center justify-center bg-gray-100 rounded-full text-xl font-light cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-200"
  >
    <span className="font-light text-lg">{children}</span>
  </button>
);

interface QuantitySelectorProps {
  min: number;
  max: number;
  onChange: (value: number) => void;
  quantity: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ min, max, onChange, quantity }) => {
  const updateQuantity = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= min && newQuantity <= max) {
        onChange(newQuantity);
      }
    },
    [min, max, onChange]
  );

  return (
    <div className="flex items-center gap-0 font-light">
      <QuantityButton
        onClick={() => updateQuantity(quantity - 1)}
        disabled={quantity <= min}
        ariaLabel="Decrease quantity"
      >
        –
      </QuantityButton>

      <input
        type="number"
        value={quantity}
        onChange={(e) => {
          const value = e.target.value;
          onChange(value === "" ? min : Number(value));
        }}
        onBlur={() => {
          if (quantity < min || isNaN(quantity)) onChange(min);
        }}
        className="w-8 text-center text-sm font-light outline-none bg-transparent appearance-none 
                   [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        min={min}
        max={max}
      />

      <QuantityButton
        onClick={() => updateQuantity(quantity + 1)}
        disabled={quantity >= max}
        ariaLabel="Increase quantity"
      >
        +
      </QuantityButton>
    </div>
  );
};

export default QuantitySelector;
