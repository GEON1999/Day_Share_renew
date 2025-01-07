import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import TodoPagination from "@/components/pagination/todoPagination";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import { IconCheck_o, IconCheck_x, IconEmptyTodo } from "@/icons";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import Helper from "@/helper/Helper";
import { useState } from "react";

const SideTodoSection = () => {
  const router = useRouter();
  const currentTodoPage = useSearch.useSearchTodoPage();
  const id = useSearch.useSearchId();
  const [isSubmit, setIsSubmit] = useState(false);

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
    if (isSubmit) return;
    setIsSubmit(true);
    e.stopPropagation();
    checkTodo(
      { calendarId: calId, todoId },
      {
        onSuccess: () => {
          console.log("성공");
          refetch();
          setIsSubmit(false);
        },
        onError: () => {
          console.log("실패");
          setIsSubmit(false);
        },
      }
    );
  };

  const handleClickTodo = (calId: number, todoId: number) =>
    router.push(`/calendar/${calId}/todo/${todoId}`);

  return (
    <section className="mt-[28px] side_todo_container">
      <ul className="space-y-2">
        <div
          className={`flex items-center justify-between content-center text-[20px]`}
        >
          전체 일정
        </div>
        {todoData?.todos && todoData.todos.length > 0 ? (
          todoData?.todos?.map((todo_group: any) => {
            return (
              <div key={todo_group.date}>
                <h4 className="bg_hilight inline-block mb-1 text-[15px] font-medium px-1">
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
                            className="w-3 h-3"
                          />
                        ) : (
                          <IconCheck_x
                            onClick={(e: any) =>
                              handleTodoClick(todo.calendarId, todo.id, e)
                            }
                            className="w-3 h-3"
                          />
                        )}
                        <span className="ml-2 text-[13px]">{todo.title}</span>
                      </div>
                    </li>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center">
            <IconEmptyTodo className={"text-white"} />
            <p className="mt-[13px] mb-[30px]">
              일정이 없어요. <br /> 추가해 볼까요?
            </p>
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
