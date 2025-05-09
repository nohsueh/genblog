import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { i18n } from "@/lib/i18n-config";
import { cn } from "@/lib/utils";
import { Languages } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function LanguageToggle() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentLocale = segments[1];
  const currentPath = segments.slice(2).join("/");
  const router = useRouter();

  const switchLocale = (locale: string) => {
    const newPathname = `/${locale}/${currentPath}`;
    router.push(newPathname);
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem
            key={locale}
            onClick={() => switchLocale(locale)}
            className={cn(
              "cursor-pointer",
              locale === currentLocale && "bg-primary/10",
            )}
          >
            {(() => {
              switch (locale) {
                case "en":
                  return "English";
                case "es":
                  return "Español";
                case "de":
                  return "Deutsch";
                case "ja":
                  return "日本語";
                case "fr":
                  return "Français";
                case "zh":
                  return "中文";
              }
            })()}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
