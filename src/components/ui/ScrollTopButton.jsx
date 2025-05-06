import React, { useState, useEffect } from "react";

const ScrollTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return isVisible ? (
    <button
      className="fixed w-10 h-10 rounded-full bg-black opacity-90 bottom-3 left-3 flex justify-center items-center z-99 hover:scale-110 transition"
      onClick={handleScrollTop}
    >
      <img src="/icons/ArrowUpward.svg" alt="Scroll to top" />
    </button>
  ) : null;
};

export default ScrollTopButton;
