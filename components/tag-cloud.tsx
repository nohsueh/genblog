"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getTagFrequency } from "@/lib/utils";
import { Analysis } from "@/types/api";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

export function TagCloud({
  analyses,
  language,
}: {
  analyses: Analysis[];
  language: Locale;
}) {
  const pathname = usePathname();
  const isTagPage = pathname.split("/")[2] === "tag";
  const tagCloud = getTagFrequency(analyses).slice(isTagPage ? 1 : 0);
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  const initialDisplayCount = isMobile ? 10 : 30;
  const tagsToShow = isExpanded
    ? tagCloud
    : tagCloud.slice(0, initialDisplayCount);

  const maxCount = Math.max(...tagCloud.map((item) => item.count));
  const minCount = Math.min(...tagCloud.map((item) => item.count));

  const getTagSize = (count: number) => {
    const minSize = 0.8;
    const maxSize = 1.2;
    if (maxCount === minCount) return 1;
    const size =
      minSize +
      ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
    return size.toFixed(2);
  };

  return (
    tagCloud.length > 0 && (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {tagsToShow.map(({ tag, count }) => (
            <Link
              key={tag}
              href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer transition-all hover:bg-accent"
                style={{
                  fontSize: `${getTagSize(count)}rem`,
                  opacity: 0.7 + (count / maxCount) * 0.3,
                }}
              >
                {tag}
              </Badge>
            </Link>
          ))}
        </div>
        {tagCloud.length > initialDisplayCount && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-center gap-2"
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
            />
          </Button>
        )}
      </div>
    )
  );
}
