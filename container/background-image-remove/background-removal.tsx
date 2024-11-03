"use client";

import { removeBackground } from "@imgly/background-removal";
import { AnimatePresence, motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import React, { useCallback } from "react";
import { Upload } from "lucide-react";
import ButtonWithLoaderComponent from "@/components/bg-image-removal/button-with-loader-component";
import ImageDisplayComponent from "@/components/bg-image-removal/image-display-component";

import DownloadButton from "@/components/bg-image-removal/download-image";

const BackgroundRemoval: React.FC = () => {
  const [originalImage, setOriginalImage] = React.useState<string | null>(null);
  const [processedImage, setProcessedImage] = React.useState<string | null>(
    null
  );
  const [isProcessing, setIsProcessing] = React.useState(false);

  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setOriginalImage(e.target?.result as string);
          setProcessedImage(null);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  const removeBg = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    try {
      const blob = await removeBackground(originalImage);
      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      if (error)
        toast.error("Failed to remove background", {
          closeButton: true,
        });
    } finally {
      toast.success("Background removed successfully", {
        closeButton: true,
      });
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#789DBC] to-[#789DBC] p-8">
      <Card className="w-full max-w-4xl border-none bg-white/10 shadow-2xl backdrop-blur-lg">
        <CardContent className="p-8">
          <h1 className="mb-8 text-center text-4xl font-bold text-white">
            Magical Background Removal
          </h1>
          <div className="space-y-6">
            <div className="relative">
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={isProcessing}
              />
              <Label
                htmlFor="image-upload"
                className={cn(
                  "flex w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/50 p-4 transition-colors hover:bg-white/5",
                  { "cursor-not-allowed": isProcessing }
                )}
              >
                <Upload className="mr-2 h-6 w-6 text-white" />
                <span className="text-white">Upload an image</span>
              </Label>
            </div>
            <div className="flex justify-center">
              <ButtonWithLoaderComponent
                onClick={removeBg}
                disabled={!originalImage || isProcessing}
                isProcessing={isProcessing}
              />
            </div>
          </div>
          <AnimatePresence>
            {(originalImage || processedImage) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2"
              >
                {originalImage && (
                  <div className="relative group">
                    <ImageDisplayComponent
                      imageSrc={originalImage}
                      label="Original Image"
                    />
                    <DownloadButton
                      className="absolute hidden group-hover:flex inset-0  items-center justify-center bg-black/50 rounded-lg transition-colors duration-300 ease-in-out"
                      imageSrc={originalImage}
                    />
                  </div>
                )}
                {processedImage && (
                  <ImageDisplayComponent
                    imageSrc={processedImage}
                    label="Processed Image"
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
};

export default BackgroundRemoval;
