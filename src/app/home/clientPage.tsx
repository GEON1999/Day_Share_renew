"use client";
import Dashboard from "@/components/main/Dashboard";
import MainLayout from "@/components/main/MainLayout";

const ClientPage = () => {
  return (
    <MainLayout>
      <div className="lg:w-full h-full bg_main px-[20px] lg:px-[200px] mt-0">
        <Dashboard />
      </div>
    </MainLayout>
  );
};

export default ClientPage;
