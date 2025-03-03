"use client";

import { motion } from "framer-motion";

const ProgressBar: React.FC = () => {
  return (
    <span className="w-full bg-gray-400 h-full overflow-hidden block">
      <motion.span
        className="h-full bg-gray-900 w-0 block"
        initial={{ width: "0%" }}
        animate={{ width: "100%" }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </span>
  );
};

export default ProgressBar;
