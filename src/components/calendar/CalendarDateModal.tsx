import TodoList from "@/components/calendar/todo/todoList";
import DiaryList from "@/components/calendar/diary/diaryList";

const CalendarDateModal = ({}) => {
  return (
    <div>
      <div className="flex flex-col w-[300px] lg:w-[480px] lg:h-[745px] text-[#2D2D2E] lg:mt-[93px]">
        <div className="space-y-[15px] lg:space-y-[29px]">
          <TodoList />
          <DiaryList />
        </div>
      </div>
    </div>
  );
};

export default CalendarDateModal;
