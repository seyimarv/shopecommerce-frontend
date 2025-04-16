"use client";

import { useCallback, useState, useEffect } from "react";

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
  className?: string;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({ min, max, onChange, quantity, className = "" }) => {
  const [showMaxReachedMessage, setShowMaxReachedMessage] = useState(false);

  useEffect(() => {
    if (quantity >= max) {
      setShowMaxReachedMessage(true);
    }
  }, [max, quantity]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showMaxReachedMessage) {
      timer = setTimeout(() => {
        setShowMaxReachedMessage(false);
      }, 8000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showMaxReachedMessage]);

  const updateQuantity = useCallback(
    (newQuantity: number) => {
      if (newQuantity >= min && newQuantity <= max) {
        onChange(newQuantity);
        // Show message if max is reached
        if (newQuantity === max) {
          setShowMaxReachedMessage(true);
        } else {
          setShowMaxReachedMessage(false);
        }
      } else if (newQuantity > max) {
        // When trying to exceed max, set to max and show message
        onChange(max);
        setShowMaxReachedMessage(true);
      }
    },
    [min, max, onChange]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = value === "" ? min : Number(value);

    if (!isNaN(numValue)) {
      if (numValue > max) {
        onChange(max);
        setShowMaxReachedMessage(true);
      } else {
        onChange(Math.max(min, numValue));
        // Show message if max is reached
        if (numValue === max) {
          setShowMaxReachedMessage(true);
        } else {
          setShowMaxReachedMessage(false);
        }
      }
    } else {
      onChange(min);
      setShowMaxReachedMessage(false);
    }
  };

  const handleBlur = () => {
    if (isNaN(quantity) || quantity < min) {
      onChange(min);
      setShowMaxReachedMessage(false);
    } else if (quantity > max) {
      onChange(max);
      setShowMaxReachedMessage(true);
    }
  };

  return (
    <div className={`relative ${className}`}>
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
          onChange={handleInputChange}
          onBlur={handleBlur}
          className="!w-8 text-center text-sm font-light outline-none bg-transparent appearance-none 
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
      {showMaxReachedMessage && (
        <div className="absolute left-0 transform mt-1">
          <p className="text-xs text-red-400 whitespace-nowrap bg-white px-1 rounded-sm">Max quantity reached</p>
        </div>
      )}
    </div>
  );
};

export default QuantitySelector;
