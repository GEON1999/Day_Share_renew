"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import TodoDetail from "@/components/calendar/todo/TodoDetail";

const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_depp">
        <TodoDetail />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
