"use client";
import Dashboard from "@/components/main/Dashboard";
import MainLayout from "@/components/main/MainLayout";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_main");
  }, []);
  return (
    <MainLayout>
      <div className="h-full w-full bg_main px-[200px]">
        {/* 메인 컨텐츠 */}
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default ClientPage;
