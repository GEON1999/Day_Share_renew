"use client";
import Dashboard from "@/components/main/Dashboard";
import MainLayout from "@/components/main/MainLayout";
import { useEffect } from "react";

const ClientPage = () => {
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg_depp");
  }, []);
  return (
    <MainLayout>
      <div className="flex w-full h-full bg_depp">
        {/* 메인 컨텐츠 */}
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default ClientPage;
