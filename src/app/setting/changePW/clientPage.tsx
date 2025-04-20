"use client";
import MainLayout from "@/components/main/MainLayout";
import ChangePassword from "@/components/setting/ChangePassword";
const ChangePasswordClientPage = () => {
  return (
    <MainLayout>
      <div className="flex w-full h-full bg_main">
        {/* 메인 컨텐츠 */}
        <ChangePassword />
      </div>
    </MainLayout>
  );
};

export default ChangePasswordClientPage;
