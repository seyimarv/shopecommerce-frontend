"use client"

/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createContext,
  useState,
  useContext,
  ReactNode,
  forwardRef,
} from "react";
import { FaAngleDown, FaAngleUp } from "react-icons/fa6";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";
import { motion, AnimatePresence } from "framer-motion";

export interface Option {
  value: string | number;
  label: string;
  href?: string; 
}

interface SelectContextProps {
  selected: Option | null;
  open: any;
  setOpen: (open: any) => void;
  handleSelect: (option: Option) => void;
}

const SelectContext = createContext<SelectContextProps | undefined>(undefined);

export const useSelect = () => {
  const context = useContext(SelectContext);
  if (!context)
    throw new Error("useSelect must be used within a Select component");
  return context;
};

interface SelectProps {
  value?: Option;
  onChange?: (option: Option) => void;
  hover?: boolean; // Enable hover interaction
  children: ReactNode;
}

export const Select = ({
  value,
  onChange,
  hover = false,
  children,
}: SelectProps) => {
  const [selected, setSelected] = useState<Option | null>(value || null);
  const [open, setOpen] = useState<boolean>(false);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onChange?.(option);
    setOpen(false);
  };

  const selectRef = useOnClickOutside<HTMLDivElement>(() => setOpen(false));

  return (
    <SelectContext.Provider value={{ selected, open, setOpen, handleSelect }}>
      <div
        className="relative w-fit"
        ref={selectRef}
        onMouseEnter={hover ? () => setOpen(true) : undefined}
        onMouseLeave={hover ? () => setOpen(false) : undefined}
      >
        {children}
      </div>
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  className?: string;
  as?: "button" | "a";
  href?: string;
  title?: string;
  placeholder?: string;
  hideIcon?: boolean;
  onClick?: any;
  open?: boolean;
}

interface SelectContentProps {
  children: ReactNode;
  className?: string;
}

export const SelectTriggerBase = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SelectTriggerProps
>(
  (
    {
      className,
      as: Component = "button",
      href,
      title,
      placeholder,
      hideIcon,
      ...props
    },
    ref
  ) => {
    return (
      <Component
        ref={ref as any}
        className={`flex gap-1 py-[.6rem] px-4 border items-center min-w-[5.5rem] w-full rounded-lg justify-between cursor-pointer tracking-wider text-xs ${className}`}
        {...(href ? { href } : { onClick: props.onClick })}
      >
        <span>{title || placeholder}</span>
        {!hideIcon && (
          <>
            {props.open ? <FaAngleUp size={15} /> : <FaAngleDown size={15} />}
          </>
        )}
      </Component>
    );
  }
);

SelectTriggerBase.displayName = "SelectTriggerBase";

export const SelectTrigger = forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  SelectTriggerProps
>(({ className, as, href, title, placeholder, hideIcon }, ref) => {
  const { selected, open, setOpen } = useSelect();

  return (
    <SelectTriggerBase
      ref={ref}
      as={as}
      href={href}
      title={title || selected?.label}
      placeholder={placeholder}
      hideIcon={hideIcon}
      className={className}
      open={open}
      onClick={(e: { preventDefault: () => void }) => {
        if (!href) {
          e.preventDefault();
          setOpen((prev: boolean) => !prev);
        }
      }}
    />
  );
});

SelectTrigger.displayName = "SelectTrigger";

export const SelectContentBase = ({ children, className }: SelectContentProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
        exit: { duration: 1, ease: "easeInOut", delay: 0.15 }, // Delay only on exit
      }}
      className={`absolute left-0 bg-white border border-gray-300 shadow-sm z-50 overflow-y-scroll w-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export const SelectContent = ({ children, className }: SelectContentProps) => {
  const { open } = useSelect();

  return (
    <AnimatePresence mode="wait">
      {open && (
        <SelectContentBase className={className}>{children}</SelectContentBase>
      )}
    </AnimatePresence>
  );
};

export const SelectItem = ({
  children,
  value,
  label,
  href,
  as: Component = "div",
}: {
  children: React.ReactNode;
  value: string | number;
  label: string;
  href?: string;
  as?: any;
}) => {
  const { handleSelect, selected } = useSelect();
  const isSelected = selected?.value === value;

  return (
    <Component
      className={`px-4 py-2 cursor-pointer hover:text-gray-500 text-sm flex items-center gap-2 transition-colors duration-200 ${
        isSelected ? "text-gray-500 underline" : "text-black"
      }`}
      onClick={(e: any) => {
        if (!href) {
          e.preventDefault();
          handleSelect({ value, label, href });
        }
      }}
      {...(href ? { href } : {})}
    >
      {children}
    </Component>
  );
};
