import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import TodoList from "@/components/calendar/todo/todoList";
import DiaryList from "@/components/calendar/diary/diaryList";

const CalendarDateModal = () => {
  return (
    <div>
      <div className="flex flex-col w-[610px] h-[715px] text-[#2D2D2E]">
        <div className="space-y-[38px]">
          <TodoList />
          <DiaryList />
        </div>
      </div>
    </div>
  );
};

export default CalendarDateModal;
