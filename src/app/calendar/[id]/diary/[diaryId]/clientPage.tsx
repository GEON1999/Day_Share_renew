"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import DiaryDetail from "@/components/calendar/diary/DiaryDetail";

const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_depp">
        <DiaryDetail />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
