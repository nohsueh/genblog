"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getTagFrequency } from "@/lib/utils";
import { Analysis } from "@/types/api";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Badge } from "./ui/badge";

export function TagCloud({
  analyses,
  language,
}: {
  analyses: Analysis[];
  language: Locale;
}) {
  const tagCloud = getTagFrequency(analyses);
  const isMobile = useIsMobile();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);
  const maxCount = Math.max(...tagCloud.map((item) => item.count));

  useEffect(() => {
    if (!containerRef.current) return;

    let animationFrameId: number;
    let scrollPosition = 0;
    const container = containerRef.current;
    const totalWidth = container.scrollWidth;

    const animate = () => {
      if (!isPaused && container) {
        scrollPosition += 0.5; // 基础滚动速度
        if (scrollPosition >= totalWidth / 2) {
          scrollPosition = 0;
        }
        container.scrollLeft = scrollPosition;
      }
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPaused]);

  return (
    tagCloud.length > 0 && (
      <div
        ref={containerRef}
        className="max-w-full overflow-x-hidden whitespace-nowrap"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="inline-flex gap-2 py-2" style={{ minWidth: "200%" }}>
          {tagCloud.map(({ tag, count }) => (
            <Link
              key={`${tag}-1`}
              href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer whitespace-nowrap hover:bg-accent"
                style={{
                  transition: `transform ${Math.max(0.5, count / maxCount)}s`,
                  transform: isPaused ? "scale(1.1)" : "scale(1)",
                }}
              >
                {tag}
                {count > 1 && `(${count})`}
              </Badge>
            </Link>
          ))}
          {tagCloud.map(({ tag, count }) => (
            <Link
              key={`${tag}-2`}
              href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer whitespace-nowrap hover:bg-accent"
                style={{
                  transition: `transform ${Math.max(0.5, count / maxCount)}s`,
                  transform: isPaused ? "scale(1.1)" : "scale(1)",
                }}
              >
                {tag}
                {count > 1 && `(${count})`}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    )
  );
}
