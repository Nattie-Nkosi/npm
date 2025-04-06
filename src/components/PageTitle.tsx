import { useEffect } from "react";

interface PageTitleProps {
  title: string;
  children?: React.ReactNode;
}

export default function PageTitle({ title, children }: PageTitleProps) {
  useEffect(() => {
    // Set the document title when the component mounts
    const previousTitle = document.title;
    document.title = title;

    // Restore the previous title when the component unmounts
    return () => {
      document.title = previousTitle;
    };
  }, [title]);

  // This component doesn't render anything visible
  return <>{children}</>;
}
