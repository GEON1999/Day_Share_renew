"use client";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState, useCallback, Suspense } from "react";
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
import ProfileSectionFallback from "@/components/fallback/profileSectionFallback";
import TodoSectionFallback from "@/components/fallback/todoSectionFallback";
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleClickMain = useCallback(() => router.push("/"), [router]);
  const handleClickSetting = useCallback(
    () => router.push("/setting"),
    [router]
  );

  const handleLogout = useCallback(async () => {
    await signOut();
  }, []);

  const toggleSidebar = useCallback(() => setIsOpen(true), []);

  useEffect(() => {
    if (!isOpen) return;

    const handleResize = () => {
      if (window.innerWidth > 1024) setIsOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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

              <Suspense fallback={<ProfileSectionFallback isOpen={isOpen} />}>
                <ProfileSection isOpen={isOpen} />
              </Suspense>

              <IconCircleSetting
                onClick={handleClickSetting}
                aria-label="설정 페이지로 이동"
                className={`w-[30px] h-[30px] cur transition-all duration-300 lg:mt-0 lg:absolute lg:top-[316px] lg:left-[160px] ${
                  isOpen
                    ? "mt-0 absolute top-[185px] left-[145px]"
                    : "mt-[50px]"
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
            <Suspense fallback={<TodoSectionFallback />}>
              <TodoSection />
            </Suspense>
          </div>
        </div>
      </aside>
      <main className={`flex-grow bg-gray-50 ${isOpen ? "blur-sm" : ""}`}>
        {children}
        {isOpen && (
          <div
            onClick={() => setIsOpen(false)}
            aria-label="사이드바 닫기"
            className="absolute inset-0 z-[50] cursor-default"
          />
        )}
      </main>
    </div>
  );
};

export default MainLayout;
