"use client";

import { useEffect, useRef, useState } from "react";

interface OnThisPageProps {
  headings: Array<{ id: string; text: string; level: number }>;
}

export function OnThisPage({ headings }: OnThisPageProps) {
  const [activeId, setActiveId] = useState<string>("");
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" },
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  useEffect(() => {
    if (activeId && itemRefs.current[activeId]) {
      itemRefs.current[activeId]?.scrollIntoView({ block: "nearest" });
    }
  }, [activeId]);

  return (
    <>
      {headings.length > 0 && (
        <nav className="sticky top-8 h-[40vh] space-y-2 overflow-y-auto">
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
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById(item.id);
                if (element) {
                  const headerOffset = 128;
                  const elementPosition = element.getBoundingClientRect().top;
                  const offsetPosition =
                    elementPosition + window.scrollY - headerOffset;
                  window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth",
                  });
                }
                setActiveId(item.id);
              }}
            >
              {item.text}
            </a>
          ))}
        </nav>
      )}
    </>
  );
}
