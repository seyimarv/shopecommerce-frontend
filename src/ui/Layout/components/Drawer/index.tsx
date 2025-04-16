import useOnClickOutside from "@/lib/hooks/useOnClickOutside";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ReactNode } from "react";
import cancelCursor from "@/ui/common/icons/cancel-cursor";
import { useEffect } from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  position?: "top" | "right" | "bottom" | "left";
  absolute?: boolean;
  children: ReactNode;
  wrapperClassName?: string;
  className?: string;
  overlayClassName?: string;
  contentAnimation?: Variants; // ✅ FIX: Explicitly use Variants
  overlayAnimation?: Variants; // ✅ FIX: Explicitly use Variants
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  style?: any;
}

interface DrawerContentProps {
  isOpen: boolean;
  position: "top" | "right" | "bottom" | "left";
  children: ReactNode;
  className?: string;
  animation?: Variants; // ✅ FIX: Explicitly use Variants
  onClose: () => void;
}

interface OverlayProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  animation?: Variants; // ✅ FIX: Explicitly use Variants
}

const defaultContentAnimations: Record<string, Variants> = {
  top: { 
    hidden: { y: "-100%", transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }, 
    visible: { y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } } 
  },
  right: { 
    hidden: { x: "100%", transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }, 
    visible: { x: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } } 
  },
  bottom: { 
    hidden: { y: "100%", transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }, 
    visible: { y: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } } 
  },
  left: { 
    hidden: { x: "-100%", transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } }, 
    visible: { x: 0, transition: { duration: 0.5, ease: [0.25, 1, 0.5, 1] } } 
  },
};

const defaultOverlayAnimation: Variants = {
  hidden: { opacity: 0, transition: { duration: 0.5, ease: "easeOut" } },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeIn" } },
};

export const Drawer = ({
  isOpen,
  onClose,
  position = "right",
  absolute = false,
  children,
  wrapperClassName = "",
  className = "",
  overlayClassName = "",
  contentAnimation,
  overlayAnimation,
  style = {}, // Accepts custom styles
}: DrawerProps) => {
  useEffect(() => {
    if (!absolute) {
      if (isOpen) {
        document.body.classList.add("overflow-hidden");
      } else {
        document.body.classList.remove("overflow-hidden");
      }
      return () => document.body.classList.remove("overflow-hidden");
    }
  }, [isOpen, absolute]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className={`${
            absolute ? "absolute" : "fixed"
          } inset-0 z-[1000] flex overflow-hidden transition-opacity duration-500 ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          } ${wrapperClassName}`}
          style={style}
        >
          <Overlay
            isOpen={isOpen}
            onClose={onClose}
            className={overlayClassName}
            animation={overlayAnimation}
          />
          <DrawerContent
            isOpen={isOpen}
            position={position}
            className={className}
            animation={contentAnimation}
            onClose={onClose}
          >
            {children}
          </DrawerContent>
        </div>
      )}
    </AnimatePresence>
  );
};

export const DrawerContent = ({
  position,
  children,
  className = "",
  animation,
  onClose,
}: DrawerContentProps) => {
  const variants = animation || defaultContentAnimations[position];
  
  const handleClickOutside = (event: MouseEvent | TouchEvent) => {
    const target = event.target as HTMLElement;
    if (target.closest('[data-drawer-toggle]')) {
      return;
    }
    onClose();
  };
  
  const ref = useOnClickOutside<HTMLDivElement>(handleClickOutside);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      ref={ref}
      variants={variants}
      transition={{ duration: 0.5, ease: [0.25, 1, 0.5, 1] }}
      style={{
        willChange: "transform",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
      }}
      className={`absolute bg-white shadow-lg overflow-y-auto ${className} ${
        position === "right"
          ? "top-0 right-0 h-full w-full max-w-[450px]"
          : position === "left"
          ? "top-0 left-0 h-full w-full max-w-[450px]"
          : position === "top"
          ? "top-0 left-0 w-full h-auto"
          : "bottom-0 left-0 w-full h-auto"
      }`}
    >
      {children}  
    </motion.div>
  );
};

export const Overlay = ({
  onClose,
  className = "",
  animation,
}: OverlayProps) => {
  const variants = animation || defaultOverlayAnimation;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={variants}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        willChange: "opacity",
        ...{ cursor: `url(${cancelCursor}), auto` }
      }}
      className={`absolute inset-0 bg-black/50 ${className}`}
      onClick={onClose}

    />
  );
};
