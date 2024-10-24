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

  const { data: todoData, isLoading } = useTodoQueries.useGetTodos(
    calendarId,
    `date=${date}`
  );

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });

  const handleClickTodo = (id: number) => {
    router.push(`/calendar/${calendarId}/todo/${id}`);
  };

  const handleTodoClick = (calId: number, todoId: number) => {
    checkTodo(
      { calendarId: calId, todoId },
      {
        onSuccess: () => {
          console.log("성공");
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  return (
    <>
      <h1 className="text-2xl font-bold mt-4 text-start mb-5">일정</h1>
      <div className="space-y-3">
        {todoData?.length === 0 || !todoData ? (
          <p className="p-5">일정이 없습니다</p>
        ) : (
          todoData?.map((todo: any) => {
            return (
              <div
                onClick={() => handleClickTodo(todo.id)}
                key={todo.id}
                className="cur flex justify-between items-center p-5 bg_ligth rounded-lg bor"
              >
                <div className="">
                  <div className="flex items-center space-x-2">
                    <img
                      src={todo.userProfile.img}
                      alt="profile"
                      className="w-12 h-12 rounded-full bor"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg">{todo.title}</p>
                      <p className="gray text-sm">{todo.userProfile.name}</p>
                    </div>
                  </div>
                  <div className="my-4"> {todo.content} </div>
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
                  <input
                    onClick={() => handleTodoClick(todo.calendarId, todo.id)}
                    type="checkbox"
                    defaultChecked={todo.isCompleted}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </>
  );
};

export default TodoList;
