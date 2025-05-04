import "prismjs";
import "prismjs/components/prism-markup-templating.js";
import "prismjs/plugins/copy-to-clipboard/prism-copy-to-clipboard";
import "prismjs/plugins/line-numbers/prism-line-numbers.css";
import "prismjs/plugins/toolbar/prism-toolbar.css";
import "prismjs/themes/prism-okaidia.css";
import rehypeExternalLinks from "rehype-external-links";
import rehypePrism from "rehype-prism";
import rehypeSanitize from "rehype-sanitize";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { Plugin, unified } from "unified";

export interface Heading {
  id: string;
  text: string;
  level: number;
}

interface MarkdownProps {
  content: string;
  onHeadingsExtracted?: (headings: Heading[]) => void;
}

// Dynamic import Prism language
const loadedLanguages: Record<string, boolean> = {};
function loadPrismLanguage(lang: string) {
  if (!lang || loadedLanguages[lang]) return;
  try {
    require(`prismjs/components/prism-${lang}.js`);
    loadedLanguages[lang] = true;
  } catch (e) {
    console.error(`Failed to load Prism language: ${lang}`, e);
  }
}

export function markdownToHtml(markdown: string) {
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
  codeLangs.forEach((lang) => loadPrismLanguage(lang));

  const file = unified()
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
    .processSync(markdown);

  return {
    html: String(file),
    headings,
  };
}

export function Markdown({ content, onHeadingsExtracted }: MarkdownProps) {
  const { html, headings } = markdownToHtml(content);

  if (onHeadingsExtracted) {
    onHeadingsExtracted(headings);
  }

  return (
    <div
      className="prose prose-sm prose-gray w-full max-w-none break-all dark:prose-invert sm:prose-base prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-500 focus:prose-a:text-blue-500 active:prose-a:text-blue-500"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
