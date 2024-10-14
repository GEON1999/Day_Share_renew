"use client";
import useSearch from "@/hooks/useSearch";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentTodoPage = useSearch.useSearchTodoPage();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { data: todoData, isLoading: todoIsLoading } =
    useUserQueries.useGetUserTodos(`todo_page=${currentTodoPage}`);
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

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

  const handleClickMain = () => {
    router.push("/");
  };

  const handleClickSetting = () => {
    router.push("/setting");
  };

  const handleLogout = async () => {
    deleteCookie("AccessToken");
    await signOut();
  };

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

  // // 화면 크기 변화에 따른 사이드바 상태 업데이트
  // useEffect(() => {
  //   const handleResize = () => {
  //     if (window.innerWidth < 1600) {
  //       setIsSidebarOpen(false);
  //     } else {
  //       setIsSidebarOpen(true);
  //     }
  //   };

  //   window.addEventListener("resize", handleResize);
  //   handleResize(); // 페이지 로드 시 초기 사이드바 상태 설정

  //   return () => {
  //     window.removeEventListener("resize", handleResize);
  //   };
  // }, []);

  return (
    <div className="flex h-screen min-h-[1080px]">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "w-[350px] min-w-[350px]" : "w-0"
        } bg-[#EFDACC] p-8 transition-all duration-300  flex flex-col justify-between side_bar`}
      >
        <div>
          <div
            className={`${isSidebarOpen ? "block" : "hidden"} flex flex-col items-center`}
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
            <div className="rounded-full bg-gray-200 w-40 h-40 mb-4 border-black border-2">
              <img
                src={userData.img}
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <p className="font-semibold text-lg">{userData.name}</p>
          </div>
          <nav className={`${isSidebarOpen ? "block" : "hidden"} mt-8`}>
            <ul>
              <li className="mb-4 text-lg flex items-center cur">
                <img
                  className="w-12 h-12"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864922152.jpg"
                />
                <span className="mt-1" onClick={handleClickMain}>
                  메인화면
                </span>
              </li>
            </ul>
          </nav>
          {/* 개인 일정 */}
          {isSidebarOpen && (
            <section className="mt-8 bg-white p-4 rounded-lg shadow-4 border-2 mb-4">
              <div className="flex items-center justify-between content-center mb-4">
                <h3 className="font-bold text-xl">공유 일정</h3>
                <div className="flex space-x-3">
                  <button onClick={handleTodoPrevBtn}>&lt;</button>
                  <button onClick={handleTodoNextBtn}>&gt;</button>
                </div>
              </div>
              <ul className="space-y-2">
                {todoData?.todos?.map((todo: any) => {
                  return (
                    <li key={todo.id} className="flex items-center">
                      <input
                        onClick={() =>
                          handleTodoClick(todo.calendarId, todo.id)
                        }
                        defaultChecked={todo.isCompleted}
                        type="checkbox"
                        className="mr-2"
                      />
                      <span>{todo.title}</span>
                    </li>
                  );
                })}
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
                className="mb-4 text-lg flex items-center cur"
                onClick={handleClickSetting}
              >
                <img
                  className="w-12 h-12"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864878122.jpg"
                />
                <span>설정</span>
              </li>
              <li
                className="mb-4 text-lg flex items-center cur"
                onClick={handleLogout}
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

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default MainLayout;
