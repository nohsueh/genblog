"use client";

import { Search } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SiteSearchProps extends React.HTMLAttributes<HTMLFormElement> {
  site: string;
}

export function SiteSearch({ site, className, ...props }: SiteSearchProps) {
  const [query, setQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
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
      className={cn("relative w-full max-w-3xl mx-auto", className)}
      {...props}
    >
      <div className="relative">
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-full pl-4 pr-12 h-12 shadow-md border-neutral-200 focus-visible:ring-offset-0"
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
