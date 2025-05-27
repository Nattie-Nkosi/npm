import { useState, useEffect, useMemo } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface ReadmeRendererProps {
  content: string;
  maxHeight?: string | number;
  showTableOfContents?: boolean;
}

interface HeadingInfo {
  id: string;
  text: string;
  level: number;
}

export default function ReadmeRenderer({
  content,
  maxHeight = "60vh",
  showTableOfContents = true,
}: ReadmeRendererProps) {
  const [expanded, setExpanded] = useState(false);
  const [showToc, setShowToc] = useState(showTableOfContents);
  const [showExpander, setShowExpander] = useState(true);

  // Cache the processed content as memoized value
  const { processedContent, headings } = useMemo(() => {
    if (!content) return { processedContent: "", headings: [] };

    // Process markdown content
    const extractedHeadings: HeadingInfo[] = [];

    // Function to safely escape HTML in code blocks
    const escapeHtml = (unsafe: string) => {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    // Generate a unique ID for headings
    const generateId = (text: string, index: number): string => {
      const baseId = text.toLowerCase().replace(/[^\w]+/g, "-");
      const existingIds = extractedHeadings.map((h) => h.id);
      if (!existingIds.includes(baseId)) return baseId;
      return `${baseId}-${index}`;
    };

    // Store code blocks temporarily
    const codeBlocks: string[] = [];
    let processedText = content;

    // First, extract and store code blocks to prevent them from being processed
    processedText = processedText.replace(
      /```(\w*)\n([\s\S]*?)\n```/g,
      (_, language, code) => {
        const lang = language || "text";
        const index = codeBlocks.length;
        codeBlocks.push(
          `<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4"><code class="language-${lang}">${escapeHtml(
            code
          )}</code></pre>`
        );
        return `__CODE_BLOCK_${index}__`;
      }
    );

    // Process inline code before other replacements
    processedText = processedText.replace(
      /`([^`]+)`/g,
      '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
    );

    // Process headings
    processedText = processedText.replace(
      /^(#{1,6})\s+(.*?)$/gm,
      (_, hashes, text) => {
        const level = hashes.length;
        const id = generateId(text, extractedHeadings.length);
        extractedHeadings.push({ id, text, level });

        const sizeClass =
          level === 1
            ? "text-3xl"
            : level === 2
            ? "text-2xl"
            : level === 3
            ? "text-xl"
            : level === 4
            ? "text-lg"
            : "text-base";

        return `<h${level} id="${id}" class="group flex items-center font-bold my-4 scroll-mt-20 ${sizeClass}">
        ${text}
        <a href="#${id}" class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <span class="text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>
        </a>
      </h${level}>`;
      }
    );

    // Bold text
    processedText = processedText.replace(
      /\*\*(.*?)\*\*/g,
      "<strong>$1</strong>"
    );

    // Italic text
    processedText = processedText.replace(/\*(.*?)\*/g, "<em>$1</em>");

    // Links
    processedText = processedText.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
    );

    // Images
    processedText = processedText.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      '<img src="$2" alt="$1" class="max-w-full my-4 rounded-md" loading="lazy" />'
    );

    // Lists
    processedText = processedText.replace(
      /^[\*\-]\s+(.+)$/gm,
      '<li class="ml-6 list-disc">$1</li>'
    );
    processedText = processedText.replace(
      /^\d+\.\s+(.+)$/gm,
      '<li class="ml-6 list-decimal">$1</li>'
    );

    // Wrap consecutive list items in ul/ol tags
    processedText = processedText.replace(
      /(<li class="ml-6 list-disc">[\s\S]*?<\/li>)+/g,
      '<ul class="my-4 list-inside">$&</ul>'
    );
    processedText = processedText.replace(
      /(<li class="ml-6 list-decimal">[\s\S]*?<\/li>)+/g,
      '<ol class="my-4 list-inside">$&</ol>'
    );

    // Horizontal rule
    processedText = processedText.replace(
      /^---+$/gm,
      '<hr class="my-6 border-t border-gray-300" />'
    );

    // Blockquotes
    processedText = processedText.replace(
      /^>\s+(.+)$/gm,
      '<blockquote class="pl-4 border-l-4 border-gray-300 italic my-4">$1</blockquote>'
    );

    // Simple table support
    processedText = processedText.replace(/\|(.+)\|/g, (match) => {
      if (match.includes("---")) {
        return ""; // Skip separator rows
      }
      const cells = match
        .split("|")
        .filter(Boolean)
        .map((cell) => `<td class="border px-4 py-2">${cell.trim()}</td>`)
        .join("");
      return `<tr>${cells}</tr>`;
    });

    // Wrap tables
    processedText = processedText.replace(
      /(<tr>[\s\S]*?<\/tr>)+/g,
      '<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300">$&</table></div>'
    );

    // Paragraphs - wrap lines that aren't already wrapped
    processedText = processedText
      .split("\n")
      .map((line) => {
        const trimmed = line.trim();
        if (
          trimmed &&
          !trimmed.startsWith("<") &&
          !trimmed.startsWith("__CODE_BLOCK_") &&
          trimmed.length > 0
        ) {
          return `<p class="my-4">${trimmed}</p>`;
        }
        return line;
      })
      .join("\n");

    // Restore code blocks
    codeBlocks.forEach((block, index) => {
      processedText = processedText.replace(`__CODE_BLOCK_${index}__`, block);
    });

    // Clean up extra whitespace
    processedText = processedText.replace(/\n{3,}/g, "\n\n");

    return {
      processedContent: processedText,
      headings: extractedHeadings,
    };
  }, [content]);

  // Determine if content needs an expander based on actual content height
  useEffect(() => {
    if (!content) return;

    const contentElement = document.querySelector(".readme-content");
    if (!contentElement) return;

    const checkHeight = () => {
      const contentHeight = contentElement.scrollHeight;
      const containerMaxHeight =
        typeof maxHeight === "number" ? maxHeight : parseInt(maxHeight, 10);

      setShowExpander(contentHeight > containerMaxHeight);
    };

    // Check immediately and after a short delay (for images/fonts to load)
    checkHeight();
    const timer = setTimeout(checkHeight, 100);

    return () => clearTimeout(timer);
  }, [content, maxHeight, processedContent]);

  if (!content) {
    return (
      <div className="bg-gray-50 border rounded-md p-6 text-center">
        <p className="text-gray-500">No README content available</p>
      </div>
    );
  }

  return (
    <div className="readme-container bg-white rounded-lg shadow-sm">
      {/* Controls */}
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="font-semibold">README</h3>
        <div className="flex gap-3">
          {showTableOfContents && headings.length > 0 && (
            <button
              onClick={() => setShowToc(!showToc)}
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
            >
              {showToc ? "Hide" : "Show"} Table of Contents
            </button>
          )}
          {showExpander && (
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-sm text-gray-600 hover:text-blue-600 flex items-center gap-1"
            >
              {expanded ? (
                <>
                  <FaChevronUp className="text-xs" /> Collapse
                </>
              ) : (
                <>
                  <FaChevronDown className="text-xs" /> Expand
                </>
              )}
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Table of Contents */}
        {showToc && headings.length > 0 && (
          <nav className="w-full md:w-64 p-4 border-r bg-gray-50">
            <h4 className="font-semibold mb-2 text-gray-700">Contents</h4>
            <ul className="space-y-1">
              {headings.map((heading) => (
                <li
                  key={heading.id}
                  style={{ paddingLeft: `${(heading.level - 1) * 0.5}rem` }}
                  className="text-sm hover:text-blue-600"
                >
                  <a
                    href={`#${heading.id}`}
                    className="block hover:underline py-1 text-gray-700 hover:text-blue-600"
                  >
                    {heading.text}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        )}

        {/* Content */}
        <div
          className={`readme-content p-6 overflow-x-auto w-full relative ${
            expanded ? "" : "overflow-y-auto"
          }`}
          style={{ maxHeight: expanded ? "none" : maxHeight }}
        >
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {!expanded && showExpander && (
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent pointer-events-none">
              <button
                onClick={() => setExpanded(true)}
                className="absolute left-1/2 bottom-2 transform -translate-x-1/2 bg-white border px-4 py-1 rounded-full text-sm hover:bg-gray-50 shadow-sm pointer-events-auto"
              >
                Show more
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
