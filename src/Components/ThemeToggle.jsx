import React from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useTheme } from "../Context/themeContext";

const ThemeToggle = () => {
  const { toggleTheme } = useTheme();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const stringLength = useTransform(y, (latestY) => latestY + 64);

  const handleDragEnd = (event, info) => {
    if (info.offset.y > 20 || Math.abs(info.offset.x) > 30) {
      toggleTheme();
    }
  };

  const handleClick = async () => {
    await animate(y, 10, { duration: 0.15 });
    toggleTheme();
    await animate(y, 0, { type: "spring", stiffness: 400, damping: 10 });
  };

  return (
    <div className="fixed top-0 right-10 flex flex-col items-center z-50 w-10">
      <svg
        className="absolute top-0 overflow-visible pointer-events-none"
        style={{ left: "50%" }}
        width="1"
        height="1"
      >
        <motion.line
          x1="0"
          y1="0"
          x2={x}
          y2={stringLength}
          stroke="#9ca3af"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      <motion.div
        style={{ x, y, marginTop: 64 }}
        drag
        dragConstraints={{ top: 0, bottom: 0, left: 0, right: 0 }}
        dragElastic={0.6}
        onDragEnd={handleDragEnd}
        onClick={handleClick}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="group w-4 h-8 rounded-full bg-accent shadow-lg shadow-accent/50 border border-base-100 cursor-pointer relative z-10 flex justify-center"
      >
        <span className="absolute top-full mt-4 px-2 py-1 bg-base text-accent text-xs font-medium rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
          Toggle Theme
        </span>
      </motion.div>
    </div>
  );
};

export default ThemeToggle;