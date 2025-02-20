"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import CalendarUserProfile from "@/components/calendar/profile/CalendarUserProfile";
const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="w-full h-full bg_main px-[10px] lg:px-[200px] mt-0">
        <CalendarUserProfile />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
