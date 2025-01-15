import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { IconExit, IconLogo } from "@/icons";
import SideCalendarProfile from "./side/sideCalendarProfile";
import SideUserList from "./side/sideUserList";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const handleClickMain = () => router.push("/");
  const handleLogout = async () => {
    await signOut();
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className={"side_container shadow-side border-r-[1.5px]  z-10"}>
        <div>
          <div className={`flex flex-col items-center`}>
            <div className="mt-[45px]">
              <IconLogo
                onClick={handleClickMain}
                className="w-[108px] h-[108px] cur"
              />
            </div>
            <SideCalendarProfile />
            <SideUserList />
            {/* <SideTodoSection /> */}
            <button onClick={handleLogout} className="btn_logout mt-[27px]">
              <IconExit className="w-5 h-5 cur" />
              <p>로그아웃</p>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default CalendarLayout;
