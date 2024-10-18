"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import TodoCreate from "@/components/calendar/todo/todoCreate";

const ClientPage = () => {
  return (
    <CalendarLayout>
      <div className="flex w-full h-full bg_depp">
        <TodoCreate />
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
