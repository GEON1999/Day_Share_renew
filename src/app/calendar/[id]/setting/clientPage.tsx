"use client";
import CalendarSetting from "@/components/calendar/setting/CalendarSetting";
import { useEffect } from "react";
import CalendarLayout from "@/components/calendar/CalendarLayout";
const SettingClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_main");
  }, []);
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
