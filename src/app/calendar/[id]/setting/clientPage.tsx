"use client";
import CalendarSetting from "@/components/calendar/setting/CalendarSetting";
import CalendarLayout from "@/components/calendar/CalendarLayout";
const SettingClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_main">
        {/* 메인 컨텐츠 */}
        <CalendarSetting />
      </div>
    </CalendarLayout>
  );
};

export default SettingClientPage;
