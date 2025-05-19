"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getDefaultFavicon } from "@/lib/utils";
import { EllipsisVertical } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "./language-toggle";
import { SiteSearch } from "./site-search";

interface SiteHeaderProps {
  language: Locale;
  dictionary: any;
  isAdmin?: boolean;
}

export function SiteHeader({
  language,
  dictionary,
  isAdmin = false,
}: SiteHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const pathname = usePathname();
  const isConsolePage = pathname.split("/")[2] === "console";

  return (
    <header className="sticky top-0 z-50 flex w-full flex-col items-center justify-center border-b bg-background">
      <div className="container flex h-16 w-full max-w-5xl items-center space-x-2 md:space-x-4">
        {!isSearching && (
          <div className="flex flex-shrink-0 flex-row items-center md:space-x-2 lg:space-x-6">
            <Link
              href={`${getBaseUrl()}/${language}`}
              className="flex flex-row items-center space-x-1"
            >
              <Image
                alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
                src={getDefaultFavicon()}
                width={40}
                height={40}
                priority={true}
                className="size-10 rounded-lg object-cover"
              />
              <span className="hidden whitespace-nowrap font-bold md:block">
                {process.env.NEXT_PUBLIC_APP_NAME}
              </span>
            </Link>
            <nav className="hidden flex-shrink-0 md:flex md:items-center md:space-x-2 lg:space-x-6">
              <Link
                href={
                  `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
                  `${getBaseUrl()}/${language}`
                }
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {dictionary.header.home}
              </Link>
              {isAdmin && (
                <Link
                  href={`${getBaseUrl()}/${language}/console/1`}
                  className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                >
                  {dictionary.header.dashboard}
                </Link>
              )}
            </nav>
          </div>
        )}
        <div className="flex w-full items-center justify-end md:space-x-4">
          {!isConsolePage && (
            <SiteSearch
              site={getBaseUrl().replace("https://", "")}
              onFocus={() => setIsSearching(true)}
              onBlur={() => setIsSearching(false)}
            />
          )}
          {!isSearching && (
            <nav className="flex items-center space-x-2">
              <div className="hidden items-center space-x-2 md:flex">
                <LanguageToggle />
                <ThemeToggle />
              </div>
              <Sheet>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <EllipsisVertical className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="md:hidden">
                  <nav className="mt-4 flex flex-col gap-4">
                    <Link
                      href={
                        `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` ||
                        `${getBaseUrl()}/${language}`
                      }
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {dictionary.header.home}
                    </Link>
                    {isAdmin && (
                      <Link
                        href={`${getBaseUrl()}/${language}/console/1`}
                        className="text-sm font-medium transition-colors hover:text-primary"
                      >
                        {dictionary.header.dashboard}
                      </Link>
                    )}
                    <div className="flex flex-col">
                      <LanguageToggle />
                      <ThemeToggle />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
