"use client";
import { dodum } from "@/app/fonts";
import { IconExit, IconSetting } from "@/icons";
import useUserQueries from "@/queries/user/useUserQueries";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const SettingLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const handleClickMain = () => router.push("/");

  const handleClickSetting = () => router.push("/setting");

  const handleLogout = async () => {
    deleteCookie("AccessToken");
    await signOut();
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
          isSidebarOpen ? "w-[350px]" : "w-0"
        } bg_depp p-8 transition-all duration-300  flex flex-col justify-between side_bar`}
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
                  "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024185055_5c68aca703554836aff212384ba69795.png"
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

export default SettingLayout;
