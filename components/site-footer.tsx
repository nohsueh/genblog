import type { Locale } from "@/lib/i18n-config";
import Link from "next/link";

interface SiteFooterProps {
  lang: Locale;
  dictionary: any;
}

export function SiteFooter({ lang, dictionary }: SiteFooterProps) {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © 2025 Searchlysis Blog Builder Demo. All rights reserved.
        </p>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link href="https://searchlysis.com">Powered by Searchlysis</Link>
        </p>
      </div>
    </footer>
  );
}
