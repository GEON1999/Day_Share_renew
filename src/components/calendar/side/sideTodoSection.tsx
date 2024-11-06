import { dodum } from "@/app/fonts";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import TodoPagination from "@/components/pagination/todoPagination";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import { IconCheck_o, IconCheck_x, IconStar_o, IconStar_x } from "@/icons";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import Helper from "@/helper/Helper";

const SideTodoSection = () => {
  const router = useRouter();
  const currentTodoPage = useSearch.useSearchTodoPage();
  const id = useSearch.useSearchId();

  const {
    data: todoData,
    isLoading: todoLoading,
    refetch,
  } = useTodoQueries.useGetTodosByCalendarId(
    id,
    `todo_page=${currentTodoPage}`
  );

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });

  const handleTodoClick = (calId: number, todoId: number, e: any) => {
    e.stopPropagation();
    checkTodo(
      { calendarId: calId, todoId },
      {
        onSuccess: () => {
          console.log("성공");
          refetch();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleClickTodo = (calId: number, todoId: number) =>
    router.push(`/calendar/${calId}/todo/${todoId}`);

  return (
    <section className="mt-[37px] px-[17px] bg-white w-[300px] bor shadow_box rounded-md flex flex-col justify-between">
      <ul className="space-y-2">
        <div
          className={`flex items-center justify-between content-center my-[20px] text-[25px] ${dodum.className}`}
        >
          전체 일정
        </div>
        {todoData?.todos && todoData.todos.length > 0 ? (
          todoData?.todos?.map((todo_group: any) => {
            return (
              <div key={todo_group.date}>
                <h4 className="bg_hilight inline-block mb-[16px] text-[18px] font-medium px-1">
                  {Helper.formatWithoutYear(todo_group.date)}
                </h4>
                {todo_group.todos.map((todo: any) => {
                  return (
                    <li
                      key={todo.id}
                      className="flex items-center justify-between p-1 rounded-md  cursor-pointer"
                      onClick={() => handleClickTodo(todo.calendarId, todo.id)}
                    >
                      <div className="flex items-center ">
                        {todo.isCompleted ? (
                          <IconCheck_o
                            onClick={(e: any) =>
                              handleTodoClick(todo.calendarId, todo.id, e)
                            }
                            className="w-5 h-5"
                          />
                        ) : (
                          <IconCheck_x
                            onClick={(e: any) =>
                              handleTodoClick(todo.calendarId, todo.id, e)
                            }
                            className="w-5 h-5"
                          />
                        )}
                        <span className="ml-2">{todo.title}</span>
                      </div>
                    </li>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col justify-center items-center space-y-3 text-[18px]">
            <p>일정이 없어요. 추가해 볼까요?</p>
            <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025225527_364fa9372c964ae5a25b055171d97dd5.png" />
          </div>
        )}
      </ul>
      {todoData?.todos && (
        <TodoPagination total_count={todoData?.total_count} />
      )}
    </section>
  );
};

export default SideTodoSection;
