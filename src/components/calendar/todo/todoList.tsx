import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconAdd, IconCheck_o, IconCheck_x, IconEmptyTodo } from "@/icons";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

const TodoList = () => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const {
    data: todoData,
    isLoading,
    refetch,
  } = useTodoQueries.useGetTodos(calendarId, `date=${date}`);

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });

  const handleClickTodo = (id: number) => {
    router.push(`/calendar/${calendarId}/todo/${id}?date=${date}`);
  };

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

  const handleAddBtn = () =>
    router.push(`/calendar/${calendarId}/todo/create?date=${date}`);

  return (
    <div className="">
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl">공유 일정</h1>
          <IconAdd onClick={handleAddBtn} className="w-5 h-5 cur" />
        </div>
        <div>{/* 페이징 추가 */}</div>
      </div>
      <div className="flex-grow overflow-hidden px-[25px] bor w-[480px] h-[140px] mt-[10px] rounded-md bg_deep_2 py-[10px] shadow_box">
        {todoData?.length === 0 || !todoData ? (
          <div className="flex justify-between items-center h-full px-[13px]">
            <p className="text-gray-500 text-[20px]">
              일정이 없어요. 추가해 볼까요?
            </p>
            <IconEmptyTodo className="w-[134px] h-[162.36px] mt-12" />
          </div>
        ) : (
          todoData?.map((todo: any, index: number) => {
            console.log(todo);
            return (
              <div
                onClick={() => handleClickTodo(todo.id)}
                key={todo.id}
                className={`h-[40px] cur flex justify-between items-center py-[10px] text-[20px] ${
                  index != 2 ? "border-b border-[#49494950]" : ""
                }`}
              >
                <div className={`flex items-center space-x-[15px]`}>
                  <div>{Helper.formatTimeForTodo(todo.startAt)}</div>
                  <div>{todo.title}</div>
                </div>
                <div className="flex items-center space-x-[15px]">
                  <div>{todo.userProfile.name}</div>
                  <div
                    className="w-5 h-5"
                    onClick={(e) =>
                      handleTodoClick(todo.calendarId, todo.id, e)
                    }
                  >
                    {todo.isCompleted ? <IconCheck_o /> : <IconCheck_x />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default TodoList;
