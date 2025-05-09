"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutAdmin } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { getBaseUrl } from "@/lib/utils";
import { EllipsisVertical, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { LanguageToggle } from "./language-toggle";
import { SiteSearch } from "./site-search";

interface SiteHeaderProps {
  lang: Locale;
  dictionary: any;
  isAdmin?: boolean;
}

export function SiteHeader({
  lang,
  dictionary,
  isAdmin = false,
}: SiteHeaderProps) {
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push(`/${lang}/console`);
    router.refresh();
  };

  return (
    <header className="sticky z-50 top-0 w-full border-b bg-background">
      <div className="container flex w-full h-16 items-center space-x-2 md:space-x-4">
        <div
          className={`${isSearching ? "hidden" : "flex"} space-x-6 md:flex md:space-x-10`}
        >
          <Link
            href={
              `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` || `/${lang}`
            }
            className="flex items-center space-x-2"
          >
            <Image
              alt={process.env.NEXT_PUBLIC_APP_NAME || ""}
              src={"/favicon.ico"}
              width={40}
              height={40}
            ></Image>
            <span className="hidden md:inline-block font-bold text-nowrap">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>
          <nav className="hidden space-x-6 md:flex">
            <Link
              href={`/${lang}`}
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:text-primary active:text-primary"
            >
              {dictionary.header.home}
            </Link>
            {isAdmin && (
              <Link
                href={`/${lang}/console`}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary focus:text-primary active:text-primary"
              >
                {dictionary.header.dashboard}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex items-center justify-end w-full md:space-x-4">
          <SiteSearch
            site={getBaseUrl().replace("https://", "")}
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
          />
          <nav className="flex items-center space-x-2">
            <div className="hidden items-center space-x-2 md:flex">
              <LanguageToggle />
              <ThemeToggle />
              {isAdmin && (
                <Button variant="ghost" size="icon" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
                  <span className="sr-only">{dictionary.header.logout}</span>
                </Button>
              )}
            </div>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <EllipsisVertical className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="mt-4 flex flex-col gap-4">
                  <Link
                    href={`/${lang}`}
                    className="text-sm font-medium transition-colors hover:text-primary focus:text-primary active:text-primary"
                  >
                    {dictionary.header.home}
                  </Link>
                  {isAdmin && (
                    <Link
                      href={`/${lang}/console`}
                      className="text-sm font-medium transition-colors hover:text-primary focus:text-primary active:text-primary"
                    >
                      {dictionary.header.dashboard}
                    </Link>
                  )}
                  <div className="flex flex-col">
                    <LanguageToggle />
                    <ThemeToggle />
                    {isAdmin && (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleLogout}
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="sr-only">
                          {dictionary.header.logout}
                        </span>
                      </Button>
                    )}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}
