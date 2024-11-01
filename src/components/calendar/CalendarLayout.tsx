import { dodum } from "@/app/fonts";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import SettingModal from "@/components/modal/SettingModal";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import DeleteModal from "@/components/modal/DeleteModal";
import Helper from "@/helper/Helper";
import { IconCheck_o, IconCheck_x, IconExit, IconSetting } from "@/icons";
import TodoPagination from "../pagination/todoPagination";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentTodoPage = useSearch.useSearchTodoPage();
  const [isOpen, setIsOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<null | Number>(null);
  const [isHover, setIsHover] = useState(false);
  const id = useSearch.useSearchId();
  const { data: todoData, isLoading: todoLoading } =
    useTodoQueries.useGetTodosByCalendarId(id, `todo_page=${currentTodoPage}`);
  console.log("todoData", todoData);

  const { data: userList, isLoading: userListLoading } =
    useCalendarQueries.useGetCalendarPermissionList(id);

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
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleClickDeletePermission = (userId: number) => {
    setIsConfirmOpen(true);
    setDeleteUserId(userId);
  };

  const handleClickMain = () => router.push("/");
  const handleCLickCalendar = () =>
    router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);

  const handleClickTodo = (calId: number, todoId: number) =>
    router.push(`/calendar/${calId}/todo/${todoId}`);

  const handleClickSetting = () => setIsOpen(true);

  const handleLogout = async () => {
    deleteCookie("AccessToken");
    await signOut();
  };

  const handleUserMouse = (bool: boolean) => setIsHover(bool);

  const handleTodoPrevBtn = () => {
    if (currentTodoPage === "1") return;
    params.set("todo_page", String(Number(currentTodoPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleTodoNextBtn = () => {
    if (todoData?.total_count <= Number(currentTodoPage) * 5) return;
    params.set("todo_page", String(Number(currentTodoPage) + 1));

    console.log("params", params.toString());
    router.push(`${pathName}?${params.toString()}`);
  };

  const { mutate: deleteCalendarPermission } = useMutation({
    mutationFn: useCalendarMutations.deleteCalendarPermission,
  });

  const handleDeletePermission = () => {
    deleteCalendarPermission(
      { calendarId: id, userId: deleteUserId },
      {
        onSuccess: (result) => {
          if (result) {
            alert("유저 추방에 성공하였습니다.");
          } else {
            alert("유저 추방에 실패하였습니다.");
          }
          window.location.reload();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  return (
    <div className="flex h-screen min-h-[1080px]">
      {/* Sidebar */}
      <aside
        className={
          "side_container shadow-side border-r-[1.5px] border-[#494949] z-10"
        }
      >
        <div>
          <div className={`flex flex-col items-center`}>
            <div className="mt-[74px]">
              <img
                onClick={handleClickMain}
                src={
                  "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024185055_5c68aca703554836aff212384ba69795.png"
                }
                alt="logo"
                className="w-full h-full object-cover ml-3 cur"
              />
            </div>
            <div
              onMouseEnter={() => handleUserMouse(true)}
              onMouseLeave={() => handleUserMouse(false)}
              className="flex flex-col items-start justify-start w-full space-y-3 mt-5"
            >
              {userList?.map((user: any) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between w-[300px]"
                >
                  <div className="flex items-center">
                    <img
                      className="w-11 h-11 rounded-full bor"
                      src={
                        user.img === ""
                          ? process.env.NEXT_PUBLIC_LOGO
                          : user.img
                      }
                    />
                    <span className="ml-2">{user.name}</span>
                  </div>
                  {isHover && (
                    <button
                      onClick={() => {
                        handleClickDeletePermission(user.userId);
                      }}
                      className="mr-4"
                    >
                      추방
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <nav className={` mt-8`}>
            <ul>
              <li
                onClick={handleClickMain}
                className="mb-4 text-lg flex items-center "
              >
                <img
                  className="w-12 h-12"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864922152.jpg"
                />
                <span className="mt-1 text-[#71665f]">메인화면</span>
              </li>
              <li
                onClick={handleCLickCalendar}
                className="mb-4 text-lg flex items-center"
              >
                <img
                  className="w-6 h-6 mx-3"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728129889231.png"
                />
                <span className="mt-1">캘린더</span>
              </li>
            </ul>
          </nav>
          {/* 개인 일정 */}
          <section className="mt-[37px] px-[17px] bg-white w-[300px] bor shadow_box rounded-md flex flex-col justify-between">
            <ul className="space-y-2">
              <div
                className={`flex items-center justify-between content-center my-[20px] text-[25px] ${dodum.className}`}
              >
                캘린더 일정
              </div>
              {todoData?.todos && todoData.todos.length > 0 ? (
                todoData?.todos?.map((todo_group: any) => {
                  return (
                    <div key={todo_group.date}>
                      <h4 className="bg_hilight inline-block mb-[16px] text-[18px] font-medium px-1">
                        {todo_group.date}
                      </h4>
                      {todo_group.todos.map((todo: any) => {
                        return (
                          <li
                            key={todo.id}
                            className="flex items-center justify-between p-1 rounded-md  cursor-pointer"
                            onClick={() =>
                              handleClickTodo(todo.calendarId, todo.id)
                            }
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
        </div>
        <div>
          <nav className="mt-2 mb-[73px] tet-[20px]">
            <ul>
              <li
                className="flex items-center cur"
                onClick={handleClickSetting}
              >
                <IconSetting className="w-8 h-8" />
                <span className={`ml-[16px] ${dodum.className}`}>설정</span>
              </li>
              <li
                className="flex items-center cur mt-[20px]"
                onClick={handleLogout}
              >
                <IconExit className="w-8 h-8" />
                <span className={`ml-[17px] ${dodum.className}`}>나가기</span>
              </li>
            </ul>
          </nav>
        </div>
      </aside>
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <SettingModal setIsOpen={setIsOpen} />
      </ModalWrapper>
      <ModalWrapper setIsOpen={setIsConfirmOpen} isOpen={isConfirmOpen}>
        <DeleteModal
          setIsOpen={setIsConfirmOpen}
          mutateFn={handleDeletePermission}
          msg=" 정말 해당 유저를 추방하시겠습니까?"
        />
      </ModalWrapper>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default CalendarLayout;
