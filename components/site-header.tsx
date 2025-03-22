"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Locale } from "@/lib/i18n-config"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/mode-toggle"
import { Globe, Menu, LogOut } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { i18n } from "@/lib/i18n-config"
import { logoutAdmin } from "@/lib/actions"

interface SiteHeaderProps {
  lang: Locale
  dictionary: any
  isAdmin?: boolean
}

export function SiteHeader({ lang, dictionary, isAdmin = false }: SiteHeaderProps) {
  const pathname = usePathname()
  const segments = pathname.split("/")
  const currentPath = segments.slice(2).join("/") || ""
  const router = useRouter()

  const switchLocale = (locale: string) => {
    if (typeof window !== "undefined") {
      const newPathname = `/${locale}/${currentPath}`
      window.location.href = newPathname
    }
  }

  const handleLogout = async () => {
    await logoutAdmin()
    router.push(`/${lang}/admin`)
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <div className="flex gap-6 md:gap-10">
          <Link href={`/${lang}`} className="flex items-center space-x-2">
            <span className="inline-block font-bold">Multilingual Blog</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link
              href={`/${lang}`}
              className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {dictionary.header.home}
            </Link>
            {isAdmin ? (
              <Link
                href={`/${lang}/admin/dashboard`}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {dictionary.header.dashboard}
              </Link>
            ) : (
              <Link
                href={`/${lang}/admin`}
                className="flex items-center text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
              >
                {dictionary.header.admin}
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Globe className="h-5 w-5" />
                  <span className="sr-only">Switch language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {i18n.locales.map((locale) => (
                  <DropdownMenuItem key={locale} onClick={() => switchLocale(locale)}>
                    {locale.toUpperCase()}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <ModeToggle />
            {isAdmin && (
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
                <span className="sr-only">{dictionary.header.logout}</span>
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-4">
                  <Link href={`/${lang}`} className="text-sm font-medium transition-colors hover:text-primary">
                    {dictionary.header.home}
                  </Link>
                  {isAdmin ? (
                    <Link
                      href={`/${lang}/admin/dashboard`}
                      className="text-sm font-medium transition-colors hover:text-primary"
                    >
                      {dictionary.header.dashboard}
                    </Link>
                  ) : (
                    <Link href={`/${lang}/admin`} className="text-sm font-medium transition-colors hover:text-primary">
                      {dictionary.header.admin}
                    </Link>
                  )}
                  {isAdmin && (
                    <Button variant="ghost" className="justify-start p-0" onClick={handleLogout}>
                      <span className="text-sm font-medium transition-colors hover:text-primary">
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
  )
}

