"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SiteSearchProps extends React.HTMLAttributes<HTMLFormElement> {
  site: string;
}

export function SiteSearch({ site, className, ...props }: SiteSearchProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key;
      if (
        key.length === 1 &&
        key !== " " &&
        !event.isComposing &&
        !event.repeat &&
        !event.ctrlKey &&
        !event.altKey &&
        !event.shiftKey &&
        !event.metaKey &&
        document.activeElement !== inputRef.current
      ) {
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      const searchUrl = `https://www.google.com/search?q=site:${site} ${encodeURIComponent(trimmedQuery)}`;
      window.open(searchUrl, "_blank");
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("relative w-full max-w-2xl", className)}
      {...props}
    >
      <div className="relative">
        <Input
          type="text"
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={`w-full rounded-full pl-4 pr-12 h-12 shadow-md border-neutral-200 focus-visible:ring-offset-0`}
        />
        <Button
          type="submit"
          size="icon"
          variant="ghost"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-neutral-100"
          disabled={!query.trim()}
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  );
}
