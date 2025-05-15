import { Locale } from "@/lib/i18n-config";
import { getBaseUrl, getTagFrequency } from "@/lib/utils";
import { Analysis } from "@/types/api";
import Link from "next/link";
import { Badge } from "./ui/badge";

export async function TagCloud({
  analyses,
  language,
  dictionary,
}: {
  analyses: Analysis[];
  language: Locale;
  dictionary: any;
}) {
  const tagCloud = getTagFrequency(analyses);

  return (
    tagCloud.length > 0 && (
      <div className="mb-8 px-5">
        <h2 className="mb-4 text-xl font-bold">
          {dictionary.blog.tagCloudOnThisPage}
        </h2>
        <div className="flex flex-wrap gap-2">
          {tagCloud.slice(0, 10).map(({ tag, count }) => (
            <Link
              key={tag}
              href={`${getBaseUrl()}/${language}/tag/${encodeURIComponent(tag)}`}
            >
              <Badge
                variant="secondary"
                className="cursor-pointer hover:bg-accent"
              >
                {tag}
                {count > 1 && `(${count})`}
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    )
  );
}
