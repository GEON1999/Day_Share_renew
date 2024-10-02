"use client";
import Dashboard from "@/components/main/Dashboard";
import MainLayout from "@/components/main/MainLayout";

const ClientPage = () => {
  return (
    <MainLayout>
      <div className="flex w-full h-full bg-[#EFDACC]">
        {/* 메인 컨텐츠 */}
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default ClientPage;
