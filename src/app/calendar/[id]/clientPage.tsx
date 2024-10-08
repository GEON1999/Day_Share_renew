"use client";

import Calendar from "@/components/calendar/Calendar";
import CalendarLayout from "@/components/calendar/CalendarLayout";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg-[#EFDACC]");
  }, []);

  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg-[#EFDACC]">
        {" "}
        <Calendar />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
