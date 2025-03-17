import { HttpTypes } from "@medusajs/types";
import clsx from "clsx";
import Divider from "@/ui/common/components/Divider";
import React from "react";

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption;
  current: string | undefined;
  updateOption: (title: string, value: string) => void;
  title: string;
  disabled: boolean;
  "data-testid"?: string;
};

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value);
  const isColor = title.toLowerCase() === "color";

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex items-center gap-x-1">
        <span className="text-sm">{title}</span>
        <div className="w-[10px]">
          <Divider />
        </div>
        <span className="text-sm">{current}</span>
      </div>
      <div
        className="flex flex-wrap gap-2"
        data-testid={dataTestId}
      >
        {filteredOptions.map((value) => {
          return (
            <button
              onClick={() => updateOption(option.id, value)}
              key={value}
              className={clsx(
                "border-ui-border-base bg-ui-bg-subtle border text-small-regular h-10 rounded-rounded p-2 flex-1",
                value === current ? "border-black scale-105" : "border-gray-300",
                isColor
                  ? "max-w-8 max-h-8 rounded-full"
                  : "px-4 py-2 rounded-md text-sm font-medium"
              )}
              style={isColor ? { backgroundColor: value } : {}}
              disabled={disabled}
              data-testid="option-button"
            >
              {!isColor && value}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OptionSelect;
