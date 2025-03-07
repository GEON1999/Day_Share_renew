// src/components/calendar/CalendarSidebar.tsx
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useCallback } from "react";
import {
  IconCircleSetting,
  IconExit,
  IconExitMobile,
  IconLogo,
  IconLogo_sm,
  IconProfile,
  IconChat,
  IconChatMobile,
} from "@/icons";
import SideCalendarProfile from "./side/sideCalendarProfile";
import SideUserList from "./side/sideUserList";
import useSearch from "@/hooks/useSearch";

interface CalendarSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CalendarSidebar: React.FC<CalendarSidebarProps> = ({
  isOpen,
  setIsOpen,
}) => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();

  const handleClickMain = useCallback(() => router.push("/home"), [router]);
  const handleClickSetting = useCallback(
    () => router.push(`/calendar/${calendarId}/setting`),
    [router, calendarId]
  );
  const handleLogout = useCallback(async () => {
    await signOut();
  }, []);

  const handleClickChat = useCallback(
    () => router.push(`/calendar/${calendarId}/chatrooms`),
    [router, calendarId]
  );

  return (
    <aside className="side_container shadow-side border-r-[1.5px] z-10">
      <div>
        <div className="flex flex-col items-center">
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

          <div className={`${isOpen ? "block" : "hidden lg:block"}`}>
            <button
              onClick={handleClickChat}
              aria-label="채팅목록 페이지로 이동"
              className="btn_logout mt-[7px] lg:mt-[15px]"
            >
              <IconChat
                className={`w-5 h-5 cur transition-all duration-300    ${
                  isOpen ? "mt-0 " : ""
                }`}
              />
              <p>채팅목록</p>
            </button>
          </div>
          <IconChatMobile
            onClick={handleClickChat}
            aria-label="채팅목록 페이지로 이동"
            className={`${
              isOpen
                ? "hidden"
                : "cur w-[30px] h-[30px] rounded-full flex justify-center items-center lg:hidden mt-[50px]"
            }`}
          />

          <button
            onClick={handleLogout}
            className={`lg:flex hidden ${
              isOpen ? "flex" : "hidden"
            } btn_logout mt-[10px]`}
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
  );
};

export default CalendarSidebar;
