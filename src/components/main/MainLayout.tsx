"use client";
import { dodum } from "@/app/fonts";
import useUserQueries from "@/queries/user/useUserQueries";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import TodoSection from "@/components/main/todoSection";
import { IconExit, IconSetting } from "@/icons";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const handleClickMain = () => router.push("/");
  const handleClickSetting = () => router.push("/setting");
  const handleLogout = async () => {
    deleteCookie("AccessToken");
    await signOut();
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
            <div className="rounded-full bg-gray-200 w-[176px] h-[176px] bor mt-[58px] shadow_box">
              <img
                src={userData.img}
                alt="profile"
                className="rounded-full w-full h-full object-cover"
              />
            </div>
            <p className={`text-[30px] mt-[20px]  ${dodum.className}`}>
              {userData.name}
            </p>
          </div>
          <TodoSection />
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
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default MainLayout;
