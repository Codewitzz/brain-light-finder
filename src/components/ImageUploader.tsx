import { useCallback, useState } from "react";
import { Upload, X, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface ImageUploaderProps {
  onImageSelect: (file: File, base64: string) => void;
  isAnalyzing: boolean;
}

const ImageUploader = ({ onImageSelect, isAnalyzing }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      const base64 = result.split(",")[1];
      onImageSelect(file, base64);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => setIsDragging(false), []);

  const clearImage = () => setPreview(null);

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!preview ? (
          <motion.label
            key="uploader"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            htmlFor="brain-upload"
            className={`
              relative flex flex-col items-center justify-center w-full h-72 
              rounded-xl border-2 border-dashed cursor-pointer transition-all duration-300
              ${isDragging
                ? "border-primary bg-primary/5 glow-primary"
                : "border-border hover:border-primary/50 hover:bg-secondary/30"
              }
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center gap-4">
              <div className="p-4 rounded-full bg-secondary">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-display text-lg font-semibold text-foreground">
                  Upload Brain Scan
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Drag & drop or click to select MRI image
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPG, PNG, DICOM formats
                </p>
              </div>
            </div>
            <input
              id="brain-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
          </motion.label>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full rounded-xl overflow-hidden border border-border bg-card"
          >
            <div className="relative aspect-square max-h-80 mx-auto overflow-hidden">
              <img
                src={preview}
                alt="Brain scan preview"
                className="w-full h-full object-contain"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                  <div className="flex flex-col items-center gap-3">
                    <Brain className="w-10 h-10 text-primary animate-pulse" />
                    <p className="text-sm font-display text-primary font-medium">
                      Analyzing scan...
                    </p>
                    <div className="w-full h-full absolute inset-0 overflow-hidden">
                      <div className="scan-line w-full h-1/3" />
                    </div>
                  </div>
                </div>
              )}
            </div>
            {!isAnalyzing && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearImage}
                className="absolute top-3 right-3 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUploader;
