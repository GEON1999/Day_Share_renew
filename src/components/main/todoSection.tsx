import useTodoMutations from "@/queries/todo/useTodoMutations";
import useUserMutations from "@/queries/user/useUserMutations";
import { useMutation } from "@tanstack/react-query";
import TodoPagination from "@/components/pagination/todoPagination";
import useSearch from "@/hooks/useSearch";
import useUserQueries from "@/queries/user/useUserQueries";
import { useRouter } from "next/navigation";
import {
  IconCheck_o,
  IconCheck_x,
  IconEmptyTodo,
  IconStar_o,
  IconStar_x,
  IconAdd,
} from "@/icons";
import Helper from "@/helper/Helper";
import { useAlert } from "@/components/alert/AlertContext";
import { useState } from "react";
import ModalContainer from "@/components/modal/ModalContainer";
import ModalType from "@/keys/ModalType";
import StaticKeys from "@/keys/StaticKeys";

const TodoSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const currentTodoPage = useSearch.useSearchTodoPage();
  const { showAlert } = useAlert();

  const {
    data: todoData,
    isLoading: todoIsLoading,
    refetch,
  } = useUserQueries.useGetUserTodos(`todo_page=${currentTodoPage}`);

  const { data: favoriteTodoData, refetch: refetchFavoriteTodo } =
    useUserQueries.useGetUserFavoriteTodo();

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });
  const { mutate: postUserFavoriteTodos } = useMutation({
    mutationFn: useUserMutations.postUserFavoriteTodo,
  });
  const { mutate: deleteUserFavoriteTodos } = useMutation({
    mutationFn: useUserMutations.deleteUserFavoriteTodo,
  });

  const handleTodoClick = (calId: number, todoId: number, e: any) => {
    e.stopPropagation();
    checkTodo(
      { calendarId: calId, todoId },
      {
        onSuccess: () => {
          refetch();
        },
        onError: () => {
          showAlert("일정 완료에 실패했습니다.", "error");
        },
      }
    );
  };

  const handleTodoFavorite = (e: any, todoId: number) => {
    e.stopPropagation();
    postUserFavoriteTodos(
      { todoId },
      {
        onSuccess: () => {
          console.log("성공");
          refetch();
          refetchFavoriteTodo();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleTodoUnFavorite = (e: any) => {
    e.stopPropagation();
    deleteUserFavoriteTodos(
      {},
      {
        onSuccess: () => {
          console.log("성공");
          refetch();
          refetchFavoriteTodo();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleAddBtn = () => setIsOpen(true);

  const handleClickTodo = (calId: number, date: string) =>
    router.push(`/calendar/${calId}?date=${date}`);

  return (
    <section className="mt-[15px] lg:mt-[38px] side_todo_container">
      <ul>
        <div
          className={`flex items-center space-x-[6px] content-center mb-[10px] text-[20px]`}
        >
          <h1 className="text-lg">전체 일정</h1>
          <IconAdd onClick={handleAddBtn} className="w-4 h-4 cur" />
        </div>
        {todoData?.todos && todoData.todos.length > 0 ? (
          todoData?.todos?.map((todo_group: any) => {
            return (
              <div key={todo_group.date} className="noto-sans-text">
                <h4 className="inline-block bg_hilight mb-1 text-base font-medium px-1">
                  {Helper.formatWithoutYear(todo_group.date)}
                </h4>
                {todo_group.todos.map((todo: any) => {
                  return (
                    <li
                      key={todo.id}
                      className="flex items-center justify-between p-1 rounded-md  cursor-pointer"
                      onClick={() =>
                        handleClickTodo(todo.calendarId, todo.date)
                      }
                    >
                      <div className="flex items-center ">
                        {todo.isCompleted ? (
                          <IconCheck_o
                            onClick={(e: any) =>
                              handleTodoClick(todo.calendarId, todo.id, e)
                            }
                            className="w-[14px] h-[14px]"
                          />
                        ) : (
                          <IconCheck_x
                            onClick={(e: any) =>
                              handleTodoClick(todo.calendarId, todo.id, e)
                            }
                            className="w-[14px] h-[14px]"
                          />
                        )}
                        <span className="ml-2 text-base">{todo.title}</span>
                      </div>
                      {todo.isFavorite ? (
                        <IconStar_o
                          onClick={(e: any) => handleTodoUnFavorite(e)}
                          className="w-[14px] h-[14px] cur"
                        />
                      ) : (
                        <IconStar_x
                          onClick={(e: any) => handleTodoFavorite(e, todo.id)}
                          className="w-[14px] h-[14px] cur"
                        />
                      )}
                    </li>
                  );
                })}
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center">
            <IconEmptyTodo
              className={"text-white h-[205.98px] w-[170px] mt-[10px]"}
            />
            <p className="mt-[7px]">일정이 없어요.</p>
            <p className="mt-[2px]">추가해 볼까요?</p>
          </div>
        )}
      </ul>
      {todoData?.todos && (
        <TodoPagination total_count={todoData?.total_count} />
      )}
      {isOpen && (
        <ModalContainer
          setIsOpen={setIsOpen}
          initialModal={ModalType.CREATE_CONTENT_HOME}
          contentType={StaticKeys.TODO}
        />
      )}
    </section>
  );
};

export default TodoSection;
