"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { logoutAdmin } from "@/lib/actions";
import type { Locale } from "@/lib/i18n-config";
import { EllipsisVertical, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LanguageToggle } from "./language-toggle";

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
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentPath = segments.slice(2).join("/") || "";
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
    router.push(`/${lang}/console`);
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link
            href={
              `https://${process.env.NEXT_PUBLIC_ROOT_DOMAIN}` || `/${lang}`
            }
            className="flex items-center space-x-2"
          >
            <span className="inline-block font-bold">
              {process.env.NEXT_PUBLIC_APP_NAME}
            </span>
          </Link>
          <nav className="hidden gap-6 md:flex">
            <Link
              href={`/${lang}`}
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {dictionary.header.home}
            </Link>
            {isAdmin && (
              <Link
                href={`/${lang}/console`}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {dictionary.header.dashboard}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
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
                    className="text-sm font-medium transition-colors hover:text-primary"
                  >
                    {dictionary.header.home}
                  </Link>
                  {isAdmin && (
                    <Link
                      href={`/${lang}/console`}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {dictionary.header.dashboard}
                    </Link>
                  )}
                  <LanguageToggle />
                  <ThemeToggle />
                  {isAdmin && (
                    <Button variant="ghost" size="icon" onClick={handleLogout}>
                      <LogOut className="h-5 w-5" />
                      <span className="sr-only">
                        {dictionary.header.logout}
                      </span>
                    </Button>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </nav>
        </div>
      </div>
    </header>
  );
}
