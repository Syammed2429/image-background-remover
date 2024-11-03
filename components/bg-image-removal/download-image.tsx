import { DownloadIcon } from "lucide-react";
import React from "react";

interface DownloadButtonProps {
  imageSrc: string;
  className?: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  imageSrc,
  className,
}) => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = imageSrc;
    link.download = "processed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button onClick={handleDownload} className={className}>
      <DownloadIcon className="h-16 w-16 mr-2" color="#fff" />
    </button>
  );
};

export default React.memo(DownloadButton);
