"use client";
import useSearch from "@/hooks/useSearch";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useUserMutations from "@/queries/user/useUserMutations";
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
  const {
    data: todoData,
    isLoading: todoIsLoading,
    refetch,
  } = useUserQueries.useGetUserTodos(`todo_page=${currentTodoPage}`);
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });
  const { mutate: postUserFavoriteTodos } = useMutation({
    mutationFn: useUserMutations.postUserFavoriteTodo,
  });
  const { mutate: deleteUserFavoriteTodos } = useMutation({
    mutationFn: useUserMutations.deleteUserFavoriteTodo,
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

  const handleTodoFavorite = (e: any, todoId: number) => {
    e.stopPropagation();
    postUserFavoriteTodos(
      { todoId },
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

  const handleTodoUnFavorite = (e: any) => {
    e.stopPropagation();
    deleteUserFavoriteTodos(
      {},
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

  const handleClickMain = () => router.push("/");

  const handleClickSetting = () => router.push("/setting");

  const handleClickTodo = (calId: number, todoId: number) =>
    router.push(`/calendar/${calId}/todo/${todoId}`);

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
      <aside className={"slide_container"}>
        <div>
          <div
            className={`${
              isSidebarOpen ? "block" : "hidden"
            } flex flex-col items-center`}
          >
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
            <div className="rounded-full bg-gray-200 w-[176px] h-[176px] bor mt-[58px] shadow_box">
              <img
                src={userData.img}
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <p className="text-[30px] mt-[20px]">{userData.name}</p>
          </div>
          {/* 개인 일정 */}
          {isSidebarOpen && (
            <section className="mt-[44px] px-[17px] bg-white w-[300px] h-[350px] bor shadow_box rounded-md flex flex-col justify-between">
              <ul className="space-y-2">
                <div className="flex items-center justify-between content-center my-[20px] ml-[6px]">
                  <h3 className="text-[25px]">전체 일정</h3>
                </div>
                {todoData?.todos?.map((todo_group: any) => {
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
                              <input
                                type="checkbox"
                                defaultChecked={todo.isCompleted}
                                onChange={() =>
                                  handleTodoClick(todo.calendarId, todo.id)
                                }
                                onClick={(e) => e.stopPropagation()}
                              />
                              <span className="ml-2">{todo.title}</span>
                            </div>
                            {todo.isFavorite ? (
                              <img
                                onClick={(e) => handleTodoUnFavorite(e)}
                                className="cur"
                                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241023004137_23b6d0dbee044271ba9a23c5cc8ee66a.png"
                              />
                            ) : (
                              <img
                                onClick={(e) => handleTodoFavorite(e, todo.id)}
                                className="cur"
                                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241023004110_282a2f2a084f41df87961c10542a9850.png"
                              />
                            )}
                          </li>
                        );
                      })}
                    </div>
                  );
                })}
              </ul>
              <div className="flex space-x-3 justify-center mb-[15px] text-[18px] font-medium">
                <div className="flex items-center space-x-[13px]">
                  <img
                    onClick={handleTodoPrevBtn}
                    className="cur"
                    src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183639_6d61ad5c8f084ca5a0987267645d79c2.png"
                  />
                  <p>{currentTodoPage}</p>
                  <img
                    onClick={handleTodoNextBtn}
                    className=" cur"
                    src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183650_8d7f7c4e14fc4108b91642bf37dde397.png"
                  />
                </div>
              </div>
            </section>
          )}
        </div>
        <div>
          <nav className="mb-[73px] tet-[20px]">
            <ul>
              <li
                className="flex items-center cur"
                onClick={handleClickSetting}
              >
                <img
                  className=""
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024191437_8c13f80fd31146aaaa1a97fd4a0a2fd0.png"
                />
                <span className="ml-[16px]">설정</span>
              </li>
              <li
                className="flex items-center cur mt-[20px]"
                onClick={handleLogout}
              >
                <img
                  className=""
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024191335_4ecd9c6c9e5047278733a8146035b70d.png"
                />
                <span className="ml-[17px]">나가기</span>
              </li>
            </ul>
          </nav>
          {/* <button
            className="p-2 bg-gray-200 rounded-md mb-4 "
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? "사이드바 닫기" : "사이드바 열기"}
          </button> */}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default MainLayout;
