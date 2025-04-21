import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { i18n } from "@/lib/i18n-config";
import { Globe } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

export function LanguageToggle() {
  const pathname = usePathname();
  const segments = pathname.split("/");
  const currentPath = segments.slice(2).join("/") || "";
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
          <Globe className="h-5 w-5" />
          <span className="sr-only">Switch language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {i18n.locales.map((locale) => (
          <DropdownMenuItem key={locale} onClick={() => switchLocale(locale)}>
            {(() => {
              switch (locale) {
                case "en":
                  return "English";
                case "es":
                  return "Español";
                case "fr":
                  return "Français";
                case "de":
                  return "Deutsch";
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
