"use client";

import { getAnalysis, updateAnalysis } from "@/lib/actions";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

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
        const updatedAnalysis = await updateAnalysis(analysisId, undefined, {
          ...metadata,
          views: (currentAnalysis.metadata?.views || metadata?.views || 0) + 1,
        });
        setViews(
          (v: number) =>
            updatedAnalysis.metadata?.views ||
            currentAnalysis.metadata?.views ||
            v + 1,
        );
      } catch (error) {
        console.error("Failed to update views:", error);
      } finally {
        setIsUpdating(false);
      }
    };
    updateViews();

    const timeoutId = setTimeout(updateViews, 1000 * 60 * 5);
    return () => clearTimeout(timeoutId);
  }, [analysisId, isUpdating, metadata]);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{views}</span>
    </div>
  );
}
