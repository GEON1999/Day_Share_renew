"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import DiaryDetail from "@/components/calendar/diary/DiaryDetail";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_main");
  }, []);

  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_main">
        <DiaryDetail />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
