"use client";

import { Search, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SiteSearchProps extends React.HTMLAttributes<HTMLFormElement> {
  site: string;
}

export function SiteSearch({ site, className, ...props }: SiteSearchProps) {
  const [query, setQuery] = React.useState("");
  const [isOpen, setIsOpen] = React.useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (trimmedQuery) {
      const searchUrl = `https://www.google.com/search?q=site:${site} ${encodeURIComponent(trimmedQuery)}`;
      window.open(searchUrl, "_blank");
    }
  };

  const toggleOpen = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  return (
    <form
      onSubmit={handleSearch}
      className={cn("relative w-full max-w-xl mx-auto", className)}
      {...props}
    >
      {/* Mobile: show only logo when closed, desktop always show search */}
      <div
        className={cn(
          "relative",
          // Hide on mobile if closed
          !isOpen ? "hidden sm:block" : "block"
        )}
      >
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full pl-4 pr-12 h-12 shadow-md border-neutral-200 focus-visible:ring-offset-0"
          autoFocus={isOpen}
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
        {/* Close icon on mobile */}
        {isOpen && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-neutral-100 sm:hidden"
            onClick={toggleOpen}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close search</span>
          </Button>
        )}
      </div>
      {/* Toggle button: only on mobile */}
      {!isOpen && (
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="sm:hidden absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12"
          onClick={toggleOpen}
        >
          <Search className="h-6 w-6" />
          <span className="sr-only">Open search</span>
        </Button>
      )}
    </form>
  );
}
