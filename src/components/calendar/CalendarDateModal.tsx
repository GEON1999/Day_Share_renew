import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import TodoList from "@/components/calendar/todo/todoList";
import DiaryList from "@/components/calendar/diary/diaryList";

const CalendarDateModal = () => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  // const { data: todoData, isLoading } = useTodoQueries.useGetTodos(
  //   calendarId,
  //   `date=${date}`
  // );
  // const { data: diaryData, isLoading: diaryIsLoading } =
  //   useDiaryQueries.useGetDiaries(calendarId, `date=${date}`);

  // console.log("diaryLoading", diaryIsLoading, "todoLoading", isLoading);

  return (
    <div>
      <div className="flex flex-col w-[610px] h-[715px] text-[#2D2D2E]">
        {/* ssr 미사용 시 다시 사용 
       {diaryIsLoading || isLoading ? (
        <div className="loading spinner"></div>
      ) : (
        <div>
          <TodoList />
          <DiaryList />
        </div>
      )} */}
        <div className="space-y-[38px]">
          <TodoList />
          <DiaryList />
        </div>
      </div>
    </div>
  );
};

export default CalendarDateModal;
