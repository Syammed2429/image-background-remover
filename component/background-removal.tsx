"use client";

import { useCallback, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import { AnimatePresence, motion } from "framer-motion";
import { DownloadIcon, Loader2, Upload, Wand2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function EnhancedBackgroundRemoval() {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

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
      if (error) toast.error("Failed to remove background");
    } finally {
      toast.success("Background removed successfully");
      setIsProcessing(false);
    }
  };

  const imageDownload = () => {
    const link = document.createElement("a");
    if (processedImage) {
      link.href = processedImage;
    }
    link.download = "processedImage.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <Button
                onClick={removeBg}
                disabled={!originalImage || isProcessing}
                className="w-full transform rounded-full bg-gradient-to-r from-[#789DBC] to-purple-500 px-6 py-2 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:from-pink-600 hover:to-purple-600 sm:w-auto"
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
              </Button>
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
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <h2 className="absolute left-0 right-0 top-0 bg-black/50 p-2 text-lg font-semibold text-white">
                      Original Image
                    </h2>
                    <motion.img
                      src={originalImage}
                      alt="Original"
                      className="h-auto w-full"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                )}
                {processedImage && (
                  <div className="group relative overflow-hidden rounded-lg shadow-xl">
                    <h2 className="absolute left-0 right-0 top-0 bg-black/50 p-2 text-lg font-semibold text-white">
                      Processed Image
                    </h2>
                    <motion.img
                      src={processedImage}
                      alt="Processed"
                      className="h-auto w-full"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg transition-colors hover:bg-black/50  duration-100 ease-in-out">
                      <DownloadIcon
                        className="h-16 w-16 text-white cursor-pointer"
                        onClick={imageDownload}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
