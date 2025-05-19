import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

interface ResourceLink {
  name: string;
  link: string;
}

interface ResourceGroup {
  group: string;
  links: ResourceLink[];
}

export function SiteFooter() {
  let resourceGroups: ResourceGroup[] = [];
  try {
    const resourceLinksStr = process.env.NEXT_PUBLIC_FOOTER_RESOURCE_LINKS;
    if (resourceLinksStr) {
      resourceGroups = JSON.parse(resourceLinksStr);
    }
  } catch (error) {
    console.error("Failed to parse NEXT_PUBLIC_FOOTER_RESOURCE_LINKS:", error);
  }

  return (
    <footer className="border-t bg-background py-4">
      <div className="container flex flex-col">
        {resourceGroups.length > 0 && (
          <>
            <div className="grid grid-cols-2 gap-4 break-all sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {resourceGroups.map((group, index) => (
                <div key={index} className="flex flex-col space-y-3">
                  <h3 className="text-sm font-medium text-foreground">
                    {group.group}
                  </h3>
                  <div className="flex flex-col space-y-2">
                    {group.links.map((link, linkIndex) => (
                      <Link
                        key={linkIndex}
                        href={link.link}
                        target="_blank"
                        rel="nofollow noopener"
                        className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline"
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <Separator className="my-4" />
          </>
        )}
        <div className="flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <p className="text-center text-sm text-muted-foreground md:text-left">
              © {new Date().getFullYear()} {process.env.NEXT_PUBLIC_APP_NAME}
            </p>
            <div className="flex flex-row">
              <Link
                href={"https://github.com/nohsueh/genblog"}
                target="_blank"
                rel="nofollow noopener"
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
        </div>
      </div>
    </footer>
  );
}
