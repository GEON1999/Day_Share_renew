import TodoList from "@/components/calendar/todo/todoList";
import DiaryList from "@/components/calendar/diary/diaryList";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { IconBackspace } from "@/icons";
import { useModalStore } from "@/store/modalStore";
import Helper from "@/helper/Helper";

const CalendarDateModal = ({}) => {
  const {
    setCalendarDateModalOpen,
    setTodoCreateModalOpen,
    setTodoDetailModalOpen,
  } = useModalStore();
  const date = useSearch.useSearchDate();
  const calendarId = useSearch.useSearchId();
  const { data: calendarBasic, isLoading: calendarBasicLoading } =
    useCalendarQueries.useGetCalendarBasic(calendarId);

  const handleClickUndo = () => {
    setCalendarDateModalOpen(false);
    setTodoCreateModalOpen(false);
    setTodoDetailModalOpen(false);
  };

  return (
    <div>
      <div className="flex flex-col w-[300px] lg:w-[480px] lg:h-[745px] text-[#2D2D2E] lg:mt-[93px]">
        <div className="flex flex-col mb-2 lg:hidden">
          <h1 className="text-xl">{calendarBasic?.name ?? "달력"}</h1>
          <div className="flex justify-between items-center w-[300px] mb-2">
            <div className="flex w-[300px] items-center space-x-4 justify-between">
              <span className="text-[30px]">
                {Helper.formatDateForTodo(date)}
              </span>
            </div>
            <IconBackspace
              onClick={handleClickUndo}
              className="w-[30px] h-[30px]  cur"
            />
          </div>
        </div>
        <div className="space-y-[15px] lg:space-y-[29px]">
          <TodoList />
          <DiaryList />
        </div>
      </div>
    </div>
  );
};

export default CalendarDateModal;
