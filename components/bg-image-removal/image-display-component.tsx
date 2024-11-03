import React from "react";
import { motion } from "framer-motion";

interface ImageDisplayProps {
  imageSrc: string;
  label: string;
}

const ImageDisplay: React.FC<ImageDisplayProps> = ({ imageSrc, label }) => (
  <div className="relative overflow-hidden rounded-lg shadow-xl">
    <h2 className="absolute left-0 right-0 top-0 bg-black/50 p-2 text-lg font-semibold text-white z-20">
      {label}
    </h2>
    <motion.img
      src={imageSrc}
      alt={label}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    />
  </div>
);

export default React.memo(ImageDisplay);
