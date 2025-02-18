"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TodoSection from "@/components/main/todoSection";
import {
  IconCircleSetting,
  IconExit,
  IconExitMobile,
  IconLogo,
  IconLogo_sm,
  IconTodo,
} from "@/icons";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const { data: userData } = useUserQueries.useGetUser();

  const handleClickMain = () => router.push("/");
  const handleClickSetting = () => router.push("/setting");
  const handleLogout = async () => {
    await signOut();
  };

  useEffect(() => {
    if (isOpen) {
      window.addEventListener("resize", () => {
        window.innerWidth > 1024 ? setIsOpen(false) : null;
      });
    }
  }, [isOpen]);

  return (
    <div className="flex h-screen lg:min-h-[900px]">
      {/* Sidebar */}
      <aside
        className={`side_container lg:w-[250px] lg:min-w-[250px] ${
          isOpen ? "" : "w-[50px]"
        } shadow-side border-r-[1.5px] z-10 ease-in-out`}
      >
        <div className="flex flex-col items-center justify-around">
          <div className="flex flex-col items-center">
            <div className="mt-[20px] lg:mt-[45px] flex flex-col items-center">
              <div className={`${isOpen ? "block" : "hidden lg:block"}`}>
                <IconLogo
                  onClick={handleClickMain}
                  className="w-[80px] lg:w-[108px] h-[80px] lg:h-[108px] cur"
                />
              </div>
              <div className={`${isOpen ? "hidden" : "block lg:hidden"}`}>
                <IconLogo_sm
                  onClick={handleClickMain}
                  className="w-[25px] h-[25px] cur"
                />
              </div>
              <div
                className={`${isOpen ? "hidden" : "block lg:hidden mt-[50px]"}`}
              >
                <img
                  src={
                    userData?.img === "" || !userData?.img
                      ? process.env.NEXT_PUBLIC_PROFILE_IMG
                      : userData?.img
                  }
                  alt="profile"
                  className="w-[30px] h-[30px] object-cover rounded-full bg-gray-200 bor"
                />
              </div>
              <IconCircleSetting
                onClick={handleClickSetting}
                className={`w-[30px] h-[30px] cur transition-all duration-300 lg:mt-0 lg:absolute lg:top-[300px] lg:left-[160px] ${
                  isOpen
                    ? "mt-0 absolute top-[185px] left-[145px]"
                    : "mt-[50px]"
                }`}
              />
            </div>
            <div
              className={`${
                isOpen
                  ? "flex flex-col items-center"
                  : "hidden lg:flex flex-col items-center"
              }`}
            >
              <img
                src={
                  userData?.img === "" || !userData?.img
                    ? process.env.NEXT_PUBLIC_PROFILE_IMG
                    : userData?.img
                }
                alt="profile"
                className="w-[100px] lg:w-[140px] h-[100px] lg:h-[140px] object-cover rounded-full bg-gray-200 bor mt-[10px] lg:mt-[36px] shadow_box"
              />
              <p className="text-[20px] mt-[8px]">{userData?.name}</p>
            </div>
            <div className={`${isOpen ? "block" : "hidden lg:block"}`}>
              <button
                onClick={handleLogout}
                className="btn_logout mt-[7px] lg:mt-[15px]"
              >
                <IconExit className="w-5 h-5 cur" />
                <p>로그아웃</p>
              </button>
            </div>
            <IconExitMobile
              onClick={handleLogout}
              className={`${
                isOpen
                  ? "hidden"
                  : "cur w-[30px] h-[30px] rounded-full flex justify-center items-center lg:hidden mt-[50px]"
              }`}
            />

            <IconTodo
              onClick={() => setIsOpen(true)}
              className={`${
                isOpen
                  ? "hidden"
                  : "cur w-[30px] h-[30px] rounded-full flex justify-center items-center lg:hidden mt-[50px]"
              }`}
            />
          </div>
          <div className={`${isOpen ? "block" : "hidden lg:block"}`}>
            <TodoSection />
          </div>
        </div>
      </aside>
      <main className={`flex-grow bg-gray-50 ${isOpen ? "blur-sm" : ""}`}>
        {children}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            className=" absolute inset-0 z-[50] cursor-default"
          />
        )}
      </main>
    </div>
  );
};

export default MainLayout;
