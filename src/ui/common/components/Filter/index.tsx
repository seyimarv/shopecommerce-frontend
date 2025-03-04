import { AnimatePresence } from "framer-motion";
import { SelectContentBase, SelectTriggerBase } from "../Select";
import { useState, type ReactNode } from "react";
import Divider from "../Divider";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";

interface FilterProps {
  children: ReactNode;
  className?: string;
  label: string;
  reset?: () => void;
  headerText?: string;
}

export const Filter: React.FC<FilterProps> = ({
  children,
  className,
  label,
  reset,
  headerText,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const selectRef = useOnClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <div className="relative" ref={selectRef}>
      <SelectTriggerBase
        title={label}
        onClick={() => setOpen((prev) => !prev)}
        className="border-none !min-w-[4rem]"
        open={open}
      />
      <AnimatePresence mode="wait">
        {open && (
          <SelectContentBase
            className={`!w-fit !min-w-xs border-1 border-gray-500 rounded-lg shadow-lg mt-2  whitespace-nowrap ${className}`}
          >
            <div className="flex justify-between p-4 text-sm items-center text-sm">
              <p>{headerText}</p>
              <span onClick={reset}>Reset</span>
            </div>
            <Divider className="w-full" />
            <div className="p-4">{children}</div>
          </SelectContentBase>
        )}
      </AnimatePresence>
    </div>
  );
};
