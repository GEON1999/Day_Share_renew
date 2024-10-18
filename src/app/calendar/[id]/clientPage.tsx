"use client";

import Calendar from "@/components/calendar/Calendar";
import CalendarLayout from "@/components/calendar/CalendarLayout";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_depp");
  }, []);

  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_depp">
        <Calendar />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
