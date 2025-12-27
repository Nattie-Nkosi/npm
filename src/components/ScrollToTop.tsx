import { useState, useEffect } from "react";
import { FiArrowUp } from "react-icons/fi";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-zinc-900 text-white p-4 rounded-2xl shadow-2xl hover:bg-zinc-800 transition-all duration-300 z-40 hover:scale-110 group"
          aria-label="Scroll to top"
        >
          <FiArrowUp size={24} className="group-hover:-translate-y-1 transition-transform" />
        </button>
      )}
    </>
  );
}
