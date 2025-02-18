import TodoList from "@/components/calendar/todo/todoList";
import DiaryList from "@/components/calendar/diary/diaryList";

const CalendarDateModal = ({
  isCalendarDateModalOpen,
  setIsCalendarDateModalOpen,
}: {
  isCalendarDateModalOpen: boolean;
  setIsCalendarDateModalOpen: (isCalendarDateModalOpen: boolean) => void;
}) => {
  return (
    <div>
      <div className="flex flex-col w-[480px] h-[745px] text-[#2D2D2E] mt-[93px]">
        <div className="space-y-[29px]">
          <TodoList
            isCalendarDateModalOpen={isCalendarDateModalOpen}
            setIsCalendarDateModalOpen={setIsCalendarDateModalOpen}
          />
          <DiaryList
            isCalendarDateModalOpen={isCalendarDateModalOpen}
            setIsCalendarDateModalOpen={setIsCalendarDateModalOpen}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarDateModal;
