"use client";

import Calendar from "@/components/calendar/Calendar";
import CalendarLayout from "@/components/calendar/CalendarLayout";

const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="w-full h-full bg_main px-[10px] lg:px-[200px]">
        <Calendar />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
