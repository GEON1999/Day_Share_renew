"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import DiaryCreate from "@/components/calendar/diary/DiaryCreate";

const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_depp">
        <DiaryCreate />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
