"use client";

import { updateAnalysis } from "@/lib/actions";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

interface ViewCounterProps {
  analysisId: string;
  initialViews: number;
}

export default function ViewCounter({
  analysisId,
  initialViews,
}: ViewCounterProps) {
  const [views, setViews] = useState(initialViews);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const updateViews = async () => {
      if (isUpdating) return;

      try {
        setIsUpdating(true);
        const updatedAnalysis = await updateAnalysis(analysisId, undefined, {
          views: views + 1,
        });
        setViews(updatedAnalysis.metadata?.views || views + 1);
      } catch (error) {
        console.error("Failed to update views:", error);
      } finally {
        setIsUpdating(false);
      }
    };

    const timeoutId = setTimeout(updateViews, 1000);
    return () => clearTimeout(timeoutId);
  }, [analysisId]);

  return (
    <div className="flex items-center gap-1 text-sm text-muted-foreground">
      <Eye className="h-4 w-4" />
      <span>{views}</span>
    </div>
  );
}
