import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_TITLE}. All
          rights reserved.
        </p>
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link href="https://searchlysis.com">Powered by Searchlysis</Link>
        </p>
      </div>
    </footer>
  );
}
