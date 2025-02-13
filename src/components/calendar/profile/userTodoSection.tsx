import Helper from "@/helper/Helper";
import { IconEmptyTodo } from "@/icons";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import TodoPagination from "@/components/pagination/todoPagination";

const UserTodoSection = () => {
  const calendarId = useSearch.useSearchId();
  const profileId = useSearch.useSearchProfileId();
  const diaryPage = useSearch.useSearchDiaryPage() ?? "1";
  const todoPage = useSearch.useSearchTodoPage() ?? "1";
  const query = `diary_page=${diaryPage}&todo_page=${todoPage}`;

  const { data: calendarUser } = useCalendarQueries.useGetCalendarUser(
    calendarId,
    profileId,
    query
  );

  console.log(calendarUser);
  return (
    <section className="w-[580px] ">
      <div className="relative">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl">
              {calendarUser?.user_profile?.name}님의 일정
            </h1>
          </div>
          <div>
            <TodoPagination total_count={calendarUser?.total_todos} />
          </div>
        </div>
        <div className="flex-grow overflow-hidden px-[25px] bor w-[580px] h-[220px] mt-[10px] rounded-md bg_deep_2 py-[10px] shadow_box">
          {calendarUser?.todos?.length === 0 || !calendarUser?.todos ? (
            <div className="flex justify-between items-center h-full px-[13px]">
              <p className="text-[#2D2D2E] text-[20px]">
                일정이 없어요. 추가해 볼까요?
              </p>
              <IconEmptyTodo className="w-[134px] h-[162.36px] mt-12" />
            </div>
          ) : (
            calendarUser?.todos?.map((todo: any, index: number) => {
              const dateString = new Date(Number(todo.date));
              return (
                <div
                  key={todo.id}
                  className={`h-[50px] flex justify-between items-center py-[10px] text-[20px] ${
                    index != 3 ? "border-b border-[#49494950]" : ""
                  }`}
                >
                  <div
                    className={`flex items-center space-x-[15px] w-[350px] overflow-hidden whitespace-nowrap`}
                  >
                    <div>{Helper.formatTimeForTodo(todo.startAt)}</div>
                    <div>{Helper.cutString(todo.title, 18)}</div>
                  </div>
                  <div className="flex items-center space-x-[15px] ">
                    <div className="w-[200px] text-right text-[#49494950] text-[15px]">
                      {Helper.formatDate(String(dateString))}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default UserTodoSection;
