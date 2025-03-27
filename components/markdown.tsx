"use client";

import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/themes/prism-okaidia.css";
import { memo, useEffect, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrism from "rehype-prism";
import rehypeSanitize from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

interface MarkdownProps {
  content: string;
}

export const Markdown = memo(function Markdown({ content }: MarkdownProps) {
  const [markdown, setMarkdown] = useState(content);

  useEffect(() => {
    markdownToHtml(content).then(setMarkdown);
  }, [content]);

  return (
    <div
      className="prose prose-sm prose-gray w-full max-w-none dark:prose-invert sm:prose-base prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500"
      dangerouslySetInnerHTML={{ __html: markdown }}
    />
  );
});

async function markdownToHtml(markdown: string) {
  const html = await unified()
    .use(remarkParse)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    })
    .use(rehypePrism, {
      plugins: ["line-numbers", "toolbar", "copy-to-clipboard"],
    })
    .use(rehypeStringify)
    .process(markdown);

  return String(html);
}
