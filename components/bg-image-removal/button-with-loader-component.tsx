import { Loader2, Wand2 } from "lucide-react";
import React from "react";

interface ButtonWithLoaderProps {
  onClick: () => void;
  disabled: boolean;
  isProcessing: boolean;
}

const ButtonWithLoader: React.FC<ButtonWithLoaderProps> = ({
  onClick,
  disabled,
  isProcessing,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full flex items-center  transform rounded-full bg-gradient-to-r from-[#789DBC] to-purple-500 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-600 sm:w-auto"
  >
    {isProcessing ? (
      <>
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Removing Background...
      </>
    ) : (
      <>
        <Wand2 className="mr-2 h-5 w-5" />
        Remove Background
      </>
    )}
  </button>
);

export default React.memo(ButtonWithLoader);
