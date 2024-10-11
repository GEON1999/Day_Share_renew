import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import SettingModal from "@/components/modal/SettingModal";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isHover, setIsHover] = useState(false);
  const id = useSearch.useSearchId();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: todoData, isLoading: todoIsLoading } =
    useUserQueries.useGetUserTodos("page=1");

  const {
    data: userList,
    isLoading: userListLoading,
    refetch,
  } = useCalendarQueries.useGetCalendarPermissionList(id);

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });
  const { mutate: deleteCalendarPermission } = useMutation({
    mutationFn: useCalendarMutations.deleteCalendarPermission,
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

  const handleDeletePermission = (userId: number) => {
    deleteCalendarPermission(
      { calendarId: id, userId },
      {
        onSuccess: (result) => {
          if (result) {
            alert("유저 추방에 성공하였습니다.");
          } else {
            alert("유저 추방에 실패하였습니다.");
          }
          refetch();
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

  const handleClickMain = () => router.push("/");

  const handleClickSetting = () => setIsOpen(true);

  const handleLogout = async () => {
    deleteCookie("AccessToken");
    await signOut();
  };

  const handleUserMouse = (bool: boolean) => setIsHover(bool);

  return (
    <div className="flex h-screen min-h-[1080px]">
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
                        handleDeletePermission(user.userId);
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

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default CalendarLayout;
