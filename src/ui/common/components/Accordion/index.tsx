"use client"

import { useState, ReactNode } from "react";
import { motion } from "framer-motion";
import { IoChevronDownSharp } from "react-icons/io5";

export interface AccordionItem {
  id: number;
  title: string;
  content: string | ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
}) => {
  const [openSections, setOpenSections] = useState<number[]>([]);

  const handleToggle = (index: number) => {
    if (allowMultiple) {
      setOpenSections((prev) =>
        prev.includes(index)
          ? prev.filter((i) => i !== index)
          : [...prev, index]
      );
    } else {
      setOpenSections((prev) => (prev.includes(index) ? [] : [index]));
    }
  };

  return (
    <div className="w-full border-t border-gray-400">
      {items.map((item, index) => {
        const isOpen = openSections.includes(index);
        return (
          <div key={index} className="border-b border-gray-400 py-3">
            <button
              className="flex justify-between w-full text-left font-normal text-gray-800"
              onClick={() => handleToggle(index)}
            >
              {item.title}
              <IoChevronDownSharp
                className={`w-5 h-5 transition-transform ${isOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={
                isOpen
                  ? { height: "auto", opacity: 1 }
                  : { height: 0, opacity: 0 }
              }
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                {typeof item.content === 'string' ? (
                  <p className="text-sm text-gray-600">{item.content}</p>
                ) : (
                  item.content
                )}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
