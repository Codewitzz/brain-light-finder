import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Brain, MapPin, Activity, Shield } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalysisData {
  detected: boolean;
  confidence: number;
  tumorType: string;
  location: string;
  description: string;
  disclaimer: string;
}

interface AnalysisResultProps {
  result: AnalysisData;
}

const AnalysisResult = ({ result }: AnalysisResultProps) => {
  const isDetected = result.detected;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full space-y-4"
    >
      {/* Main Status */}
      <Card className={`p-6 border ${isDetected ? "border-destructive/40 bg-destructive/5" : "border-success/40 bg-success/5"}`}>
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${isDetected ? "bg-destructive/20" : "bg-success/20"}`}>
            {isDetected ? (
              <AlertTriangle className="w-8 h-8 text-destructive" />
            ) : (
              <CheckCircle className="w-8 h-8 text-success" />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-display text-xl font-bold">
              {isDetected ? "Tumor Detected" : "No Tumor Detected"}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-sm text-muted-foreground">Confidence:</span>
              <Progress value={result.confidence} className="w-32 h-2" />
              <span className="text-sm font-semibold text-primary">{result.confidence}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Type</span>
          </div>
          <p className="font-display text-lg font-medium">{result.tumorType}</p>
        </Card>

        <Card className="p-4 bg-card border-border">
          <div className="flex items-center gap-3 mb-2">
            <MapPin className="w-5 h-5 text-primary" />
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Location</span>
          </div>
          <p className="font-display text-lg font-medium">{result.location}</p>
        </Card>
      </div>

      {/* Description */}
      <Card className="p-4 bg-card border-border">
        <div className="flex items-center gap-3 mb-3">
          <Activity className="w-5 h-5 text-primary" />
          <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Clinical Findings</span>
        </div>
        <p className="text-sm leading-relaxed text-secondary-foreground">{result.description}</p>
      </Card>

      {/* Disclaimer */}
      <Card className="p-4 bg-warning/5 border-warning/30">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-warning mt-0.5 shrink-0" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            {result.disclaimer || "This AI-assisted analysis is for educational purposes only and should not replace professional medical diagnosis. Always consult a qualified healthcare provider."}
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default AnalysisResult;
