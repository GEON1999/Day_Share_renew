"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import DiaryDetail from "@/components/calendar/DiaryDetail";

const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg-[#EFDACC]">
        <DiaryDetail />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
