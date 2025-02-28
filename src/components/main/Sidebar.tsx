"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import TodoSection from "@/components/main/todoSection";
import {
  IconCircleSetting,
  IconExit,
  IconExitMobile,
  IconLogo,
  IconLogo_sm,
  IconTodo,
} from "@/icons";
import ProfileSection from "@/components/main/profileSection";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();

  const handleClickMain = useCallback(() => router.push("/home"), [router]);
  const handleClickSetting = useCallback(
    () => router.push("/setting"),
    [router]
  );

  const handleLogout = useCallback(async () => {
    await signOut();
  }, []);

  const toggleSidebar = useCallback(() => setIsOpen(true), [setIsOpen]);

  return (
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
                aria-label="메인 페이지로 이동"
                className="w-[80px] lg:w-[108px] h-[80px] lg:h-[108px] cur"
              />
            </div>
            <div className={`${isOpen ? "hidden" : "block lg:hidden"}`}>
              <IconLogo_sm
                onClick={handleClickMain}
                aria-label="메인 페이지로 이동"
                className="w-[25px] h-[25px] cur"
              />
            </div>

            <ProfileSection isOpen={isOpen} />

            <IconCircleSetting
              onClick={handleClickSetting}
              aria-label="설정 페이지로 이동"
              className={`w-[30px] h-[30px] cur transition-all duration-300 lg:mt-0 lg:absolute lg:top-[316px] lg:left-[160px] ${
                isOpen ? "mt-0 absolute top-[185px] left-[145px]" : "mt-[50px]"
              }`}
            />
          </div>

          <div className={`${isOpen ? "block" : "hidden lg:block"}`}>
            <button
              onClick={handleLogout}
              aria-label="로그아웃"
              className="btn_logout mt-[7px] lg:mt-[15px]"
            >
              <IconExit className="w-5 h-5 cur" />
              <p>로그아웃</p>
            </button>
          </div>
          <IconExitMobile
            onClick={handleLogout}
            aria-label="로그아웃"
            className={`${
              isOpen
                ? "hidden"
                : "cur w-[30px] h-[30px] rounded-full flex justify-center items-center lg:hidden mt-[50px]"
            }`}
          />

          <IconTodo
            onClick={toggleSidebar}
            aria-label="할 일 메뉴 열기"
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
  );
};

export default Sidebar;
