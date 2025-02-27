import React, { useEffect, useState } from "react";
import CalendarSidebar from "@/components/calendar/CalendarSidebar";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const handleResize = () => {
        if (window.innerWidth > 1024) {
          setIsOpen(false);
        }
      };
      window.addEventListener("resize", handleResize);
      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, [isOpen]);

  return (
    <div className="flex min-h-screen">
      <CalendarSidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <main className={`flex-grow bg-gray-50 ${isOpen ? "blur-sm" : ""}`}>
        {children}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className="absolute inset-0 z-[50] cursor-default"
          />
        )}
      </main>
    </div>
  );
};

export default CalendarLayout;
