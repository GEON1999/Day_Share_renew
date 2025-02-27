"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "@/components/main/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.innerWidth > 1024) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  return (
    <div className="flex h-screen lg:min-h-[900px]">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <main className={`flex-grow bg-gray-50 ${isOpen ? "blur-sm" : ""}`}>
        {children}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            aria-label="사이드바 닫기"
            className="absolute inset-0 z-[50] cursor-default"
          />
        )}
      </main>
    </div>
  );
};

export default MainLayout;
