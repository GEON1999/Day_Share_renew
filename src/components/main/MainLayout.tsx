"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";
import TodoSection from "@/components/main/todoSection";
import { IconCircleSetting, IconExit, IconLogo } from "@/icons";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const handleClickMain = () => router.push("/");
  const handleClickSetting = () => router.push("/setting");
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div className={`flex h-screen min-h-[900px]`}>
      {/* Sidebar */}
      <aside className={"side_container shadow-side border-r-[1.5px]  z-10"}>
        <div className="flex flex-col items-center">
          <div className={`flex flex-col items-center`}>
            <div className="mt-[45px]">
              <IconLogo
                onClick={handleClickMain}
                className="w-[108px] h-[108px] cur"
              />
              <IconCircleSetting
                onClick={handleClickSetting}
                className="w-[30px] h-[30px] absolute top-[300px] left-[160px] cur"
              />
            </div>
            <div className="rounded-full bg-gray-200 w-[140px] h-[140px] bor mt-[36px] shadow_box">
              <img
                src={
                  userData?.img == ""
                    ? process.env.NEXT_PUBLIC_PROFILE_IMG
                    : userData?.img
                }
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <p className={`text-[20px] mt-[13px] `}>{userData?.name}</p>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 mt-[20px] w-[146px] h-[38px] justify-center rounded-full border-[1.5px]  border-opacity-50"
            >
              <IconExit className="w-5 h-5 cur" />
              <p>로그아웃</p>
            </button>
          </div>
          <TodoSection />
        </div>
        <div>
          <nav className="mt-2 mb-[73px] tet-[20px]">
            {/* <ul>
              <li
                className="flex items-center cur"
                onClick={handleClickSetting}
              >
                <IconSetting className="w-8 h-8" />
                <span className={`ml-[16px] `}>설정</span>
              </li>
              <li
                className="flex items-center cur mt-[20px]"
                onClick={handleLogout}
              >
                
                <span className={`ml-[17px] `}>나가기</span>
              </li>
            </ul> */}
          </nav>
        </div>
      </aside>
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default MainLayout;
