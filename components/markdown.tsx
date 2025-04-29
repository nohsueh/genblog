"use client";

import Prism from "prismjs";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/themes/prism-okaidia.css";
import { memo, useEffect, useState } from "react";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrism from "rehype-prism";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Plugin, unified } from "unified";

Prism;

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface MarkdownProps {
  content: string;
  onHeadingsExtracted?: (headings: Heading[]) => void;
}

export const Markdown = memo(function Markdown({
  content,
  onHeadingsExtracted,
}: MarkdownProps) {
  const [markdown, setMarkdown] = useState("");

  useEffect(() => {
    const processMarkdown = async () => {
      const { html, headings } = await markdownToHtml(content);
      setMarkdown(html);

      if (onHeadingsExtracted) {
        onHeadingsExtracted(headings);
      }
    };

    processMarkdown();
  }, [content, onHeadingsExtracted]);

  return (
    <div
      className="prose prose-sm prose-gray w-full max-w-none dark:prose-invert sm:prose-base prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500 break-all"
      dangerouslySetInnerHTML={{ __html: markdown }}
    />
  );
});

// Dynamic import Prism language
const loadedLanguages: Record<string, boolean> = {};
async function loadPrismLanguage(lang: string) {
  if (!lang || loadedLanguages[lang]) return;
  try {
    await import(
      /* webpackChunkName: "prismjs-[request]" */
      `prismjs/components/prism-${lang}.js`
    );
    loadedLanguages[lang] = true;
  } catch (e) {
    console.error(`Failed to load Prism language: ${lang}`, e);
  }
}

async function markdownToHtml(markdown: string) {
  const headings: Heading[] = [];

  const extractHeadings: Plugin = () => {
    return (tree: any) => {
      const visit = (node: any) => {
        if (node.type === "element" && /^h[1-6]$/.test(node.tagName)) {
          const level = Number.parseInt(node.tagName.charAt(1));
          const id = node.properties.id;

          let text = "";
          const extractText = (node: any) => {
            if (node.type === "text") {
              text += node.value;
            }
            if (node.children) {
              node.children.forEach(extractText);
            }
          };

          node.children.forEach(extractText);

          headings.push({ id, text, level });
        }

        if (node.children) {
          node.children.forEach(visit);
        }
      };

      visit(tree);
      return tree;
    };
  };

  // Extract all code block languages
  const codeLangs = Array.from(markdown.matchAll(/```([\w-]+)/g))
    .map((m) => m[1].toLowerCase())
    .filter(Boolean);
  // Only load languages that haven't been loaded
  await Promise.all(codeLangs.map((lang) => loadPrismLanguage(lang)));

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeSlug)
    .use(rehypeExternalLinks, {
      target: "_blank",
      rel: "noopener noreferrer nofollow",
    })
    .use(rehypePrism, {
      plugins: ["line-numbers", "toolbar", "copy-to-clipboard"],
    })
    .use(extractHeadings)
    .use(rehypeStringify)
    .process(markdown);

  return {
    html: String(file),
    headings,
  };
}
