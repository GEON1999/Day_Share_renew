import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import SettingModal from "@/components/modal/SettingModal";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import DeleteModal from "@/components/modal/DeleteModal";

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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: todoData, isLoading: todoLoading } =
    useTodoQueries.useGetTodosByCalendarId(id, `todo_page=${currentTodoPage}`);

  const { data: userList, isLoading: userListLoading } =
    useCalendarQueries.useGetCalendarPermissionList(id);

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });

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

  const handleClickDeletePermission = (userId: number) => {
    setIsConfirmOpen(true);
    setDeleteUserId(userId);
  };

  const handleClickMain = () => router.push("/");
  const handleCLickCalendar = () => router.push(`/calendar/${id}`);

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
        className={`${
          isSidebarOpen ? "w-[350px] min-w-[350px]" : "w-0"
        } bg_depp p-8 transition-all duration-300 overflow-hidden flex flex-col justify-between side_bar`}
      >
        <div>
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } flex flex-col items-center`}
          >
            <div className="mb-4">
              <img
                onClick={handleClickMain}
                src={
                  "https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864362722.jpg"
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
          <nav className={`${isSidebarOpen ? "block" : "hidden"} mt-8`}>
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
          {isSidebarOpen && (
            <section className="mt-8 bg-white p-4 rounded-lg shadow-4 border-2">
              <div className="flex items-center justify-between content-center mb-4">
                <h3 className="font-bold text-xl">캘린더 일정</h3>
                <div className="flex space-x-3">
                  <button onClick={handleTodoPrevBtn}>&lt;</button>
                  <button onClick={handleTodoNextBtn}>&gt;</button>
                </div>
              </div>
              <ul className="space-y-2">
                {todoData?.todos?.map((todo: any) => (
                  <li key={todo.id} className="flex items-center">
                    <input
                      onClick={() => handleTodoClick(todo.calendarId, todo.id)}
                      defaultChecked={todo.isCompleted}
                      type="checkbox"
                      className="mr-2"
                    />
                    <span
                      onClick={() => handleClickTodo(todo.calendarId, todo.id)}
                    >
                      {todo.title}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
        <div>
          <nav
            className={`${isSidebarOpen ? "block" : "hidden"} text-[#71665f]`}
          >
            <ul>
              <li
                onClick={handleClickSetting}
                className="mb-4 text-lg flex items-center"
              >
                <img
                  className="w-12 h-12"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864878122.jpg"
                />
                <span>설정</span>
              </li>
              <li
                onClick={handleLogout}
                className="mb-4 text-lg flex items-center"
              >
                <img
                  className="w-12 h-10"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864855419.jpg"
                />
                <span>나가기</span>
              </li>
            </ul>
          </nav>
          <button
            className="p-2 bg-gray-200 rounded-md mb-4 "
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
          </button>
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
