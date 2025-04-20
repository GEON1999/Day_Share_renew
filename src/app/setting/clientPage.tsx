"use client";
import Dashboard from "@/components/setting/Setting";
import MainLayout from "@/components/main/MainLayout";

const SettingClientPage = () => {
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
