import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import {
  IconCircleSetting,
  IconExit,
  IconExitMobile,
  IconLogo,
  IconLogo_sm,
  IconProfile,
} from "@/icons";
import SideCalendarProfile from "./side/sideCalendarProfile";
import SideUserList from "./side/sideUserList";
import useSearch from "@/hooks/useSearch";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const calendarId = useSearch.useSearchId();

  const handleClickMain = () => router.push("/");
  const handleClickSetting = () =>
    router.push(`/calendar/${calendarId}/setting`);
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
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside
        className={
          "side_container w-[50px] lg:w-[250px] shadow-side border-r-[1.5px]  z-10"
        }
      >
        <div>
          <div className={`flex flex-col items-center`}>
            <div className="mt-[20px] lg:mt-[45px]">
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
            </div>

            <SideCalendarProfile isOpen={isOpen} />
            <SideUserList isSideOpen={isOpen} />
            {/* <SideTodoSection /> */}
            <button
              onClick={handleLogout}
              className={`${
                isOpen ? "flex" : "hidden"
              } btn_logout mt-[10px] lg:mt-[27px]`}
            >
              <IconExit className="w-5 h-5 cur" />
              <p>로그아웃</p>
            </button>
            <IconCircleSetting
              onClick={handleClickSetting}
              className={`
                lg:hidden ${
                  isOpen
                    ? "hidden"
                    : "cur w-[30px] h-[30px] rounded-full flex justify-center items-center lg:hidden mt-[50px]"
                }`}
            />
            <IconExitMobile
              onClick={handleLogout}
              className={`
                lg:hidden ${
                  isOpen
                    ? "hidden"
                    : "cur w-[30px] h-[30px] rounded-full flex justify-center items-center lg:hidden mt-[50px]"
                }`}
            />
            <IconProfile
              onClick={() => setIsOpen(true)}
              className={`w-[30px] h-[30px] cur mt-[50px] lg:hidden ${
                isOpen ? "hidden" : "block"
              }`}
            />
          </div>
        </div>
      </aside>

      {/* Main Content */}
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

export default CalendarLayout;
