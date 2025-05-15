"use client";

import { useIsMobile } from "@/hooks/use-mobile";
import { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getTagFrequency } from "@/lib/utils";
import { Analysis } from "@/types/api";
import Link from "next/link";
import { Badge } from "./ui/badge";

export function TagCloud({
  analyses,
  language,
  dictionary,
}: {
  analyses: Analysis[];
  language: Locale;
  dictionary: any;
}) {
  const tagCloud = getTagFrequency(analyses);
  const isMobile = useIsMobile();

  return (
    tagCloud.length > 0 && (
      <div className="mb-8 flex flex-wrap gap-2 px-5">
        {tagCloud.slice(0, isMobile ? 10 : 30).map(({ tag, count }) => (
          <Link
            key={tag}
            href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
          >
            <Badge
              variant="secondary"
              className="cursor-pointer hover:bg-accent"
            >
              {tag}
              {count > 1 && `(${count})`}
            </Badge>
          </Link>
        ))}
      </div>
    )
  );
}
