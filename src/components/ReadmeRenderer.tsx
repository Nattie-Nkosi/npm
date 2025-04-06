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
      // Check if this ID already exists in our headings
      const existingIds = extractedHeadings.map((h) => h.id);
      if (!existingIds.includes(baseId)) return baseId;

      // If ID exists, append a number
      return `${baseId}-${index}`;
    };

    // Process content and extract headings
    let processed = content
      // First handle code blocks (need to do this before other elements)
      .replace(/```(\w*)\n([\s\S]*?)\n```/g, (_, language, code) => {
        const lang = language || "text";
        return `<pre class="bg-gray-800 text-white p-4 rounded-md overflow-x-auto my-4"><code class="language-${lang}">${escapeHtml(
          code
        )}</code></pre>`;
      })

      // Headings with ID for linking
      .replace(/^(#{1,6})\s+(.*?)$/gm, (_, hashes, text, index) => {
        const level = hashes.length;
        const id = generateId(text, extractedHeadings.length);
        extractedHeadings.push({ id, text, level });

        return `<h${level} id="${id}" class="group flex items-center font-bold my-4 scroll-mt-20">
          ${text}
          <a href="#${id}" class="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <span class="text-blue-500"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></svg></span>
          </a>
        </h${level}>`;
      })

      // Bold text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

      // Italic text
      .replace(/\*(.*?)\*/g, "<em>$1</em>")

      // Inline code
      .replace(
        /`([^`]+)`/g,
        '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">$1</code>'
      )

      // Links
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>'
      )

      // Images
      .replace(
        /!\[(.*?)\]\((.*?)\)/g,
        '<img src="$2" alt="$1" class="max-w-full my-4 rounded-md" loading="lazy" />'
      )

      // Fix for unordered lists
      .replace(/^[\*\-]\s+(.*?)$/gm, '<li class="ml-6 list-disc">$1</li>')

      // Ordered lists
      .replace(/^\d+\.\s+(.*?)$/gm, '<li class="ml-6 list-decimal">$1</li>')

      // Horizontal rule
      .replace(/^---+$/gm, '<hr class="my-6 border-t border-gray-300" />')

      // Blockquotes
      .replace(
        /^>\s+(.*?)$/gm,
        '<blockquote class="pl-4 border-l-4 border-gray-300 italic my-4">$1</blockquote>'
      )

      // Tables (basic support)
      .replace(/^\|(.*)\|$/gm, (match) => {
        // Check if this is a separator row
        if (match.includes("---")) {
          return '<tr class="border-b border-gray-300"></tr>';
        }

        // Process table cell content
        const cells = match
          .split("|")
          .filter(Boolean)
          .map((cell) => `<td class="border px-4 py-2">${cell.trim()}</td>`)
          .join("");

        return `<tr>${cells}</tr>`;
      })

      // Wrap table rows
      .replace(/(<tr>.*?<\/tr>)+/gs, (match) => {
        const rows = match.split("</tr>").filter(Boolean);

        // Create table structure
        if (rows.length > 0) {
          // First row is header
          const header = `<thead>${rows[0]}</tr></thead>`;

          // Rest of rows are body
          const body = rows
            .slice(1)
            .map((row) => `${row}</tr>`)
            .join("");

          return `<div class="overflow-x-auto my-4"><table class="min-w-full border-collapse border border-gray-300 rounded-md">${header}<tbody>${body}</tbody></table></div>`;
        }

        return match;
      })

      // Paragraphs (handle this last)
      .replace(/^([^<\n][^\n]+)$/gm, (_, text) => {
        if (text.trim().length > 0) {
          return `<p class="my-4">${text}</p>`;
        }
        return "";
      })

      // Clean up list items
      .replace(/<\/li>\n<li/g, "</li><li")

      // Wrap adjacent list items in ul tags
      .replace(/(<li.*?<\/li>)+/g, '<ul class="my-4 list-inside">$&</ul>')

      // Remove extra newlines
      .replace(/\n{3,}/g, "\n\n")

      // Fix double line breaks
      .replace(/\n\n/g, "<br/><br/>");

    return {
      processedContent: processed,
      headings: extractedHeadings,
    };
  }, [content]);

  // Determine if content needs an expander based on actual content height
  useEffect(() => {
    if (!content) return;

    // Get the content element
    const contentElement = document.querySelector(".readme-content");
    if (!contentElement) return;

    // Check if content is taller than maxHeight
    const contentHeight = contentElement.scrollHeight;
    const containerMaxHeight =
      typeof maxHeight === "number" ? maxHeight : parseInt(maxHeight, 10);

    setShowExpander(contentHeight > containerMaxHeight);
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
                  className={`text-sm hover:text-blue-600 ${
                    heading.level === 1
                      ? "font-medium"
                      : "pl-" + (heading.level - 1) * 2
                  }`}
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
