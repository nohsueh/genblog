"use client";

import { getAnalysis, updateAnalysis } from "@/lib/actions";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return (num / 1_000_000_000).toFixed(1) + "B";
  }
  if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(1) + "M";
  }
  if (num >= 1_000) {
    return (num / 1_000).toFixed(1) + "K";
  }
  return num.toString();
};

interface ViewCounterProps {
  analysisId: string;
  metadata?: Record<string, any>;
}

export default function ViewCounter({
  analysisId,
  metadata,
}: ViewCounterProps) {
  const [views, setViews] = useState(metadata?.views || 0);
  const [isUpdating, setIsUpdating] = useState(false);
  useEffect(() => {
    const updateViews = async () => {
      if (isUpdating) return;
      try {
        setIsUpdating(true);
        const currentAnalysis = await getAnalysis(analysisId);
        const currentViews =
          currentAnalysis.metadata?.views || metadata?.views || 0;
        const updatedAnalysis = await updateAnalysis(analysisId, undefined, {
          ...metadata,
          views: currentViews + 1,
        });
        setViews(updatedAnalysis.metadata?.views || currentViews + 1);
      } catch (error) {
        console.error("Failed to update views:", error);
      } finally {
        setIsUpdating(false);
      }
    };

    const timeoutId = setTimeout(updateViews, 0);
    return () => clearTimeout(timeoutId);
  }, [analysisId]);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{formatNumber(views)}</span>
    </div>
  );
}
