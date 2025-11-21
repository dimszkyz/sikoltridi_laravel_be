// src/components/ScrollTopButton.jsx
import React, { useEffect, useState } from "react";
import { FaArrowUp } from "react-icons/fa";

const ScrollTopButton = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const goTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={goTop}
      aria-label="Naik ke atas"
      title="Naik ke atas"
      className={`fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 grid place-items-center
                  h-12 w-12 rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/30
                  transition-all duration-300
                  ${show ? "opacity-100 translate-y-0" : "opacity-0 pointer-events-none translate-y-3"}`}
    >
      <FaArrowUp />
    </button>
  );
};

export default ScrollTopButton;
