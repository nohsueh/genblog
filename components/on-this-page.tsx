"use client";

import { Suspense, useEffect, useRef } from "react";
import { Skeleton } from "./ui/skeleton";

interface OnThisPageProps {
  headings: Array<{ id: string; text: string; level: number }>;
  activeId: string;
  dictionary: any;
}

export function OnThisPage({
  headings,
  activeId,
  dictionary,
}: OnThisPageProps) {
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    if (activeId && itemRefs.current[activeId]) {
      itemRefs.current[activeId]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeId]);

  return (
    <>
      {headings.length > 0 && (
        <div className="sticky top-8 h-[40vh] overflow-y-auto">
          <Suspense
            fallback={
              <>
                <h2 className="mb-4 text-lg font-semibold">
                  {dictionary.blog.tableOfContents}
                </h2>
                <nav className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="mb-1 h-4 w-1/2" />
                  <Skeleton className="mb-1 h-4 w-1/2" />
                  <Skeleton className="mb-1 h-4 w-1/2" />
                </nav>
              </>
            }
          >
            <h2 className="mb-4 text-lg font-semibold">
              {dictionary.blog.tableOfContents}
            </h2>
            <nav className="space-y-2">
              {headings.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  ref={(el) => {
                    itemRefs.current[item.id] = el;
                  }}
                  className={`block text-sm transition-colors ${
                    activeId === item.id
                      ? "font-medium text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  style={{ paddingLeft: `${(item.level - 1) * 1}rem` }}
                >
                  {item.text}
                </a>
              ))}
            </nav>
          </Suspense>
        </div>
      )}
    </>
  );
}
