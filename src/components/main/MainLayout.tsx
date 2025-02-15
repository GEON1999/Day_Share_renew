"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import TodoSection from "@/components/main/todoSection";
import { IconCircleSetting, IconExit, IconLogo, IconLogo_sm } from "@/icons";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const [windowWidth, setWindowWidth] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleClickMain = () => router.push("/");
  const handleClickSetting = () => router.push("/setting");
  const handleLogout = async () => {
    await signOut();
  };
  return (
    <div className={`flex h-screen lg:min-h-[900px]`}>
      {/* Sidebar */}
      <aside className={"side_container shadow-side border-r-[1.5px]  z-10"}>
        <div className="flex flex-col items-center">
          <div className={`flex flex-col items-center`}>
            <div className="mt-[45px] flex flex-col items-center">
              {windowWidth > 1024 ? (
                <IconLogo
                  onClick={handleClickMain}
                  className="w-[108px] h-[108px] cur"
                />
              ) : (
                <IconLogo_sm
                  onClick={handleClickMain}
                  className="w-[25px] h-[25px] cur"
                />
              )}
              {windowWidth < 1024 && (
                <img
                  src={
                    userData?.img == ""
                      ? process.env.NEXT_PUBLIC_PROFILE_IMG
                      : userData?.img
                  }
                  alt="profile"
                  className=" w-[30px] h-[30px] object-cover rounded-full bg-gray-200 bor mt-[50px]"
                />
              )}
              <IconCircleSetting
                onClick={handleClickSetting}
                className="w-[30px] h-[30px] mt-[50px] lg:mt-[0px] lg:absolute top-[300px] left-[160px] cur"
              />
            </div>
            {windowWidth > 1024 && (
              <>
                <img
                  src={
                    userData?.img == ""
                      ? process.env.NEXT_PUBLIC_PROFILE_IMG
                      : userData?.img
                  }
                  alt="profile"
                  className="w-[140px] h-[140px] object-cover rounded-full bg-gray-200 bor mt-[36px] shadow_box"
                />
                <p className={`text-[20px] mt-[8px]`}>{userData?.name}</p>
              </>
            )}
            {windowWidth > 1024 ? (
              <button onClick={handleLogout} className="btn_logout mt-[15px]">
                <IconExit className="w-5 h-5 cur" />
                <p>로그아웃</p>
              </button>
            ) : (
              <div className="bor w-[30px] h-[30px] mt-[50px] rounded-full flex justify-center items-center">
                <IconExit
                  onClick={handleLogout}
                  className="w-5 h-5 cur ml-[3px]"
                />
              </div>
            )}
          </div>
          {windowWidth > 1024 && <TodoSection />}
        </div>
        <div>
          <nav className="mt-2 mb-[73px] tet-[20px]"></nav>
        </div>
      </aside>
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default MainLayout;
