import Image from "next/image";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <div className="flex flex-col items-center gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
          </p>
          <div className="flex flex-row">
            <Link
              href={"https://github.com/nohsueh/genblog"}
              target="_blank"
              rel="noopener noreferrer nofollow"
            >
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/github-mark.svg`}
                alt="GitHub"
                width={24}
                height={24}
                className="block dark:hidden"
              />
              <Image
                src={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/github-mark-white.svg`}
                alt="GitHub"
                width={24}
                height={24}
                className="hidden dark:block"
              />
            </Link>
          </div>
        </div>
        {/* <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          <Link href="https://searchlysis.com">Powered by Searchlysis</Link>
        </p> */}
      </div>
    </footer>
  );
}
