"use client";
import Dashboard from "@/components/setting/Dashboard";
import SettingLayout from "@/components/setting/SettingLayout";
import { useEffect } from "react";

const SettingClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg-[#EFDACC]");
  }, []);
  return (
    <SettingLayout>
      <div className="flex w-full h-full bg-[#EFDACC]">
        {/* 메인 컨텐츠 */}
        <Dashboard />
      </div>
    </SettingLayout>
  );
};

export default SettingClientPage;
