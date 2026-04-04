import { useState } from "react";
import { Brain, Scan } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import ImageUploader from "@/components/ImageUploader";
import AnalysisResult from "@/components/AnalysisResult";

interface AnalysisData {
  detected: boolean;
  confidence: number;
  tumorType: string;
  location: string;
  description: string;
  disclaimer: string;
}

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisData | null>(null);
  const { toast } = useToast();

  const handleImageSelect = async (_file: File, base64: string) => {
    setIsAnalyzing(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke("analyze-brain", {
        body: { imageBase64: base64 },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      setResult(data);
    } catch (err: any) {
      toast({
        title: "Analysis Failed",
        description: err.message || "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 gradient-radial pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/3 blur-[150px] pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto px-6 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-6">
            <Scan className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              AI-Powered Analysis
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-primary/10 glow-primary">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight">
              Neuro<span className="text-primary">Scan</span>
            </h1>
          </div>

          <p className="text-muted-foreground max-w-md mx-auto">
            Upload a brain MRI scan and let AI analyze it for potential tumors and abnormalities
          </p>
        </motion.div>

        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <ImageUploader onImageSelect={handleImageSelect} isAnalyzing={isAnalyzing} />
        </motion.div>

        {/* Results */}
        {result && <AnalysisResult result={result} />}
      </div>
    </div>
  );
};

export default Index;
