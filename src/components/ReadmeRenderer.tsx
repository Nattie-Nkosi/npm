interface ReadmeRendererProps {
  content: string;
}

export default function ReadmeRenderer({ content }: ReadmeRendererProps) {
  if (!content) {
    return <p className="text-gray-500">No README content available</p>;
  }

  // Basic formatting for line breaks and headers
  // In a real app, you'd use a proper markdown parser like react-markdown
  const formattedContent = content
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>")
    .replace(/#{1,6}\s+(.*)/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");

  return (
    <div
      className="readme-content max-h-96 overflow-y-auto p-4"
      dangerouslySetInnerHTML={{ __html: formattedContent }}
    />
  );
}
// Note: Be cautious with dangerouslySetInnerHTML to avoid XSS attacks. In a real application, use a library like DOMPurify to sanitize the content before rendering.
// This is a simple example and may not cover all edge cases. For a production app, consider using a library like react-markdown or similar to handle markdown parsing and rendering.
