import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
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
    router.push(`/calendar/${calendarId}/todo/${id}`);
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

  return (
    <div className="small_container shadow_box">
      <div className="h-[60px] bg_hilight flex items-center justify-center flex-shrink-0">
        <h1 className="text-2xl">공유 일정</h1>
      </div>
      <div className="flex-grow overflow-y-auto space-y-3 px-2">
        {todoData?.length === 0 || !todoData ? (
          <p className="p-5">일정이 없습니다</p>
        ) : (
          todoData?.map((todo: any, index: number) => {
            return (
              <div
                onClick={() => handleClickTodo(todo.id)}
                key={todo.id}
                className={`${index === 0 ? "" : "border-t"} cur flex justify-between items-center p-5`}
              >
                <div className="">
                  <div className="flex items-center space-x-2">
                    <img
                      src={todo.userProfile?.img}
                      alt="profile"
                      className="w-12 h-12 rounded-full bor"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg">{todo.title}</p>
                      <p className="gray text-sm">{todo.userProfile?.name}</p>
                    </div>
                  </div>
                  <div className="my-4">{todo.content}</div>
                  <div className="flex space-x-2 text-xs gray">
                    <p>{Helper.formatTime(todo.startAt)}</p>
                    <p>~</p>
                    <p>{Helper.formatTime(todo.endAt)}</p>
                  </div>
                  <div className="flex space-x-3">
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-5 h-5"
                        src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076426211.png"
                      />
                      <div>{todo.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-5 h-5"
                        src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076565076.png"
                      />
                      <div>{todo.commentCount}</div>
                    </div>
                  </div>
                </div>
                <div>
                  <img
                    onClick={(e) =>
                      handleTodoClick(todo.calendarId, todo.id, e)
                    }
                    src={
                      todo.isCompleted
                        ? "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025231003_6b3276a2396647f3be3b1a82cf31eeaa.png"
                        : "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025230857_daae548a18e1488b9344e6194cd23bb5.png"
                    }
                    alt="check"
                  />
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
