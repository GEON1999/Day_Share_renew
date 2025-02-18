import CalendarTodoPagination from "@/components/pagination/calendarTodoPagination";
import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconAdd, IconCheck_o, IconCheck_x, IconEmptyTodo } from "@/icons";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import TodoDetailModal from "@/components/calendar/todo/todoDetailModal";
import TodoCreate from "./todoCreate";
import { useAlert } from "@/components/alert/AlertContext";
import StaticKeys from "@/keys/StaticKeys";
import { useModalStore } from "@/store/modalStore";

const TodoList = ({}) => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const calendarTodoPage = useSearch.useSearchCalendarTodoPage();
  const contentType = useSearch.useSearchContentType();
  const { showAlert } = useAlert();
  const {
    isCalendarDateModalOpen,
    setCalendarDateModalOpen,
    isTodoDetailModalOpen,
    setTodoDetailModalOpen,
    isTodoCreateModalOpen,
    setTodoCreateModalOpen,
  } = useModalStore();
  useEffect(() => {
    setTodoCreateModalOpen(false);
    setTodoDetailModalOpen(false);
  }, [date]);

  const {
    data: todoData,
    isLoading,
    refetch,
  } = useTodoQueries.useGetTodos(
    calendarId,
    `date=${date}&calendar_todo_page=${calendarTodoPage}`
  );

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });

  const handleClickTodo = (id: number) => {
    router.push(`/calendar/${calendarId}?date=${date}&todoId=${id}`);
    setCalendarDateModalOpen(false);
    setTodoDetailModalOpen(true);
  };

  const handleTodoComplete = (calId: number, todoId: number, e: any) => {
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

  const handleAddBtn = () => {
    setCalendarDateModalOpen(false);
    setTodoCreateModalOpen(true);
  };

  return (
    <div className="relative">
      <div
        className={`relative ${
          isCalendarDateModalOpen ? "block" : "hidden"
        } lg:block`}
      >
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl">공유 일정</h1>
            {contentType === StaticKeys.TODO ? (
              <IconAdd
                onClick={handleAddBtn}
                className="w-5 h-5 cur transition-transform duration-200 transform hover:scale-110 animate-pulse"
              />
            ) : (
              <IconAdd onClick={handleAddBtn} className="w-5 h-5 cur" />
            )}
          </div>
          <div>
            <CalendarTodoPagination total_count={todoData?.total_count} />
          </div>
        </div>
        <div className="flex-grow overflow-hidden px-[25px] bor w-[480px] h-[140px] mt-[10px] rounded-md bg_deep_2 py-[10px] shadow_box">
          {todoData?.todos?.length === 0 || !todoData ? (
            <div className="flex justify-between items-center h-full px-[13px]">
              <p className="text-[#2D2D2E] text-[20px]">
                일정이 없어요. 추가해 볼까요?
              </p>
              <IconEmptyTodo className="w-[134px] h-[162.36px] mt-12" />
            </div>
          ) : (
            todoData?.todos?.map((todo: any, index: number) => {
              return (
                <div
                  onClick={() => handleClickTodo(todo.id)}
                  key={todo.id}
                  className={`h-[40px] cur flex justify-between items-center py-[10px] text-[20px] ${
                    index != 2 ? "border-b border-[#49494950]" : ""
                  }`}
                >
                  <div
                    className={`flex items-center space-x-[15px] w-[350px] overflow-hidden whitespace-nowrap`}
                  >
                    <div>{Helper.formatTimeForTodo(todo.startAt)}</div>
                    <div>{Helper.cutString(todo.title, 18)}</div>
                  </div>
                  <div className="flex items-center space-x-[15px] ">
                    <div className="w-[100px] text-right">
                      {todo.userProfile.name}
                    </div>
                    <div
                      className="w-5 h-5 cur"
                      onClick={(e) =>
                        handleTodoComplete(todo.calendarId, todo.id, e)
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
      {isTodoCreateModalOpen && <TodoCreate refetch={refetch} />}
      {isTodoDetailModalOpen && <TodoDetailModal />}
    </div>
  );
};

export default TodoList;
