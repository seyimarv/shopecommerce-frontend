import { useState } from "react";

export interface VariantOption {
  name: string;
  value: string;
  className?: string; // Optional for non-color variants
}

interface VariantSelectorProps {
  label: string;
  options: VariantOption[];
  defaultValue?: string | null;
  allowNone?: boolean;
  onSelect: (value: string | null) => void;
  isColor?: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  label,
  options,
  defaultValue = null,
  allowNone = false,
  onSelect,
  isColor,
}) => {
  const [selected, setSelected] = useState<string | null>(defaultValue);

  const handleSelect = (value: string) => {
    const newValue = selected === value && allowNone ? null : value;
    setSelected(newValue);
    onSelect(newValue);
  };

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-sm font-medium">
        {label} - {selected || "None"}
      </h2>
      <div className="flex gap-2">
        {options.map((option) => (
          <button
            key={option.id}
            className={`transition border-2 flex items-center justify-center ${
              selected === option.id
                ? "border-black scale-105"
                : "border-gray-300"
            } ${
              isColor
                ? `w-8 h-8 rounded-full ${option.className}` 
                : "px-4 py-2 rounded-md text-sm font-medium"
            }`}
            onClick={() => handleSelect(option.value)}
            aria-label={`Select ${option.name}`}
          >
            {isColor && selected === option.value && (
              <div className="w-3 h-3 rounded-full bg-white" />
            )}
            {!isColor && option.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
