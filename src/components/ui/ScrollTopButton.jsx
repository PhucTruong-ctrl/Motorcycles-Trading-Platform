import React from "react";

const ScrollTopButton = () => {
  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  return (
    <button className="fixed w-10 h-10 rounded-full bg-black bottom-5 left-5 flex justify-center items-center z-99 hover:scale-110 transition" onClick={handleScrollTop}>
      <img src="/icons/ArrowUpward.svg" alt="" />
    </button>
  );
};

export default ScrollTopButton;
