"use client";
import Dashboard from "@/components/setting/Dashboard";
import MainLayout from "@/components/main/MainLayout";
import { useEffect } from "react";

const SettingClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_main");
  }, []);
  return (
    <MainLayout>
      <div className="flex w-full h-full bg_main">
        {/* 메인 컨텐츠 */}
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default SettingClientPage;
