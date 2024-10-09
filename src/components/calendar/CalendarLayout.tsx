import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState, useEffect } from "react";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const id = useSearch.useSearchId();
  console.log("useSearch.useSearchId() :", useSearch.useSearchId());
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: todoData, isLoading: todoIsLoading } =
    useUserQueries.useGetUserTodos("page=1");
  console.log("todoData :", todoData, todoIsLoading);

  const { data: calendarUserData, isLoading: calendarUserIsLoading } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  console.log("calendarUserData :", calendarUserData, calendarUserIsLoading);

  const { data: userList, isLoading: userListLoading } =
    useCalendarQueries.useGetCalendarPermissionList(id);
  console.log("userList :", userList, userListLoading);

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

  // 화면 크기 변화에 따른 사이드바 상태 업데이트
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1600) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // 페이지 로드 시 초기 사이드바 상태 설정

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-[350px]" : "w-0"
        } bg-[#EFDACC] p-8 transition-all duration-300 overflow-hidden flex flex-col justify-between side_bar`}
      >
        <div>
          <div
            className={`${isSidebarOpen ? "block" : "hidden"} flex flex-col items-center`}
          >
            <div className="mb-4">
              <img
                src={
                  "https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864362722.jpg"
                }
                alt="logo"
                className="w-full h-full object-cover ml-3"
              />
            </div>
            <div className="flex flex-col items-start justify-start w-full space-y-3 mt-5">
              {userList?.map((user: any) => (
                <div key={user.id} className="flex items-center">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={
                      user.img === "" ? process.env.NEXT_PUBLIC_LOGO : user.img
                    }
                  />
                  <span className="ml-2">{user.name}</span>
                </div>
              ))}
            </div>
          </div>
          <nav className={`${isSidebarOpen ? "block" : "hidden"} mt-8`}>
            <ul>
              <li className="mb-4 text-lg flex items-center ">
                <img
                  className="w-12 h-12"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864922152.jpg"
                />
                <span className="mt-1 text-[#71665f]">메인화면</span>
              </li>
              <li className="mb-4 text-lg flex items-center">
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
              <h3 className="font-bold mb-4 text-xl">개인 일정</h3>
              <ul className="space-y-2">
                {todoData?.todos?.map((todo: any) => (
                  <li key={todo.id} className="flex items-center">
                    <input
                      onClick={() => handleTodoClick(todo.calendarId, todo.id)}
                      defaultChecked={todo.isCompleted}
                      type="checkbox"
                      className="mr-2"
                    />
                    <span>{todo.title}</span>
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
              <li className="mb-4 text-lg flex items-center">
                <img
                  className="w-12 h-12"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864878122.jpg"
                />
                <span>설정</span>
              </li>
              <li className="mb-4 text-lg flex items-center">
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

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default CalendarLayout;
