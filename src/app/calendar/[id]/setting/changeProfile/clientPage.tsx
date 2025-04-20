"use client";
import CalendarLayout from "@/components/calendar/CalendarLayout";
import ChangeProfile from "@/components/calendar/setting/ChangeProfile";
const ChangeProfileClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_main">
        {/* 메인 컨텐츠 */}
        <ChangeProfile />
      </div>
    </CalendarLayout>
  );
};

export default ChangeProfileClientPage;
