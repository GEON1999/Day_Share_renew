"use client";
import Dashboard from "@/components/main/Dashboard";
import MainLayout from "@/components/main/MainLayout";
import { useEffect } from "react";

const ClientPage = () => {
  return (
    <MainLayout>
      <div className="w-full h-full bg_main px-[200px] mt-0">
        {/* 메인 컨텐츠 */}
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default ClientPage;
