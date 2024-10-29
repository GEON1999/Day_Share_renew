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

  const handleClickCreateDiary = () =>
    router.push(`/calendar/${calendarId}/diary/create?date=${date}`);

  const handleClickCreateTodo = () =>
    router.push(`/calendar/${calendarId}/todo/create?date=${date}`);

  return (
    <div className="flex flex-col bg_depp w-[600px] h-[700px] rounded-2xl p-4 bor overflow-auto">
      <div className="flex space-x-2 justify-center mt-5">
        <button
          onClick={handleClickCreateDiary}
          className="bg_deeper rounded px-4 py-2 bor"
        >
          일기 생성
        </button>
        <button
          onClick={handleClickCreateTodo}
          className="bg_deeper rounded px-4 py-2 bor"
        >
          일정 생성
        </button>
      </div>
      {/* ssr 미사용 시 다시 사용 
       {diaryIsLoading || isLoading ? (
        <div className="loading spinner"></div>
      ) : (
        <div>
          <TodoList />
          <DiaryList />
        </div>
      )} */}
      <div>
        <TodoList />
        <DiaryList />
      </div>
    </div>
  );
};

export default CalendarDateModal;
