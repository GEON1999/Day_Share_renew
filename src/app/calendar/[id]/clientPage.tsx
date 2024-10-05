"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import Dashboard from "@/components/main/Dashboard";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg-[#EFDACC]");
  }, []);

  return (
    <CalendarLayout>
      <Dashboard />
    </CalendarLayout>
  );
};

export default ClientPage;
