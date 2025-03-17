"use client";

import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useOnClickOutside from "@/lib/hooks/useOnClickOutside";
import cancelCursor from "../../icons/cancel-cursor";
import { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
}) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useOnClickOutside<HTMLDivElement>(onClose);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          className="fixed inset-0 z-1002 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ cursor: `url(${cancelCursor}), auto` }}
        >
          <motion.div
            ref={modalRef}
            className={`bg-white rounded-lg shadow-lg inline-flex flex-col cursor-default ${className}`}
            initial={{ opacity: 0, scale: 0.9, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <div className="relative">
              <button
                onClick={onClose}
                className="absolute top-2 right-2 shadow-lg w-10 h-10 rounded-full font-thin text-4xl hover:text-gray-700 cursor-pointer"
              >
                &times;
              </button>
            </div>
            <div className="w-full h-full">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
