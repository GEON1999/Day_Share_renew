"use client";

import Calendar from "@/components/calendar/Calendar";
import CalendarLayout from "@/components/calendar/CalendarLayout";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_main");
  }, []);

  return (
    <CalendarLayout>
      <div className="w-full h-full bg_main px-[200px] ">
        <Calendar />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
