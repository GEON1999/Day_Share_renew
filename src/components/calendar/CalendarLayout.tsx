import { dodum } from "@/app/fonts";
import useSearch from "@/hooks/useSearch";
import { deleteCookie } from "cookies-next";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import SettingModal from "@/components/modal/SettingModal";
import { IconExit, IconHome, IconSetting } from "@/icons";
import SideTodoSection from "./side/sideTodoSection";
import SideUserList from "./side/sideUserList";

const CalendarLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const date = useSearch.useSearchDate();
  const id = useSearch.useSearchId();

  const handleClickMain = () => router.push("/");
  const handleCLickCalendar = () => router.push(`/calendar/${id}?date=${date}`);

  const handleClickSetting = () => setIsOpen(true);

  const handleLogout = async () => {
    deleteCookie("AccessToken");
    deleteCookie("RefreshToken");
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
            <div className="mt-[74px] mb-14">
              <img
                onClick={handleClickMain}
                src={
                  "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024185055_5c68aca703554836aff212384ba69795.png"
                }
                alt="logo"
                className="w-full h-full object-cover ml-3 cur"
              />
            </div>
            <SideUserList />
          </div>
          <nav className={` mt-8`}>
            <ul>
              <li
                onClick={handleClickMain}
                className="mb-4 text-lg flex items-center ml-2"
              >
                <IconHome className="w-8 h-8" />
                <span className=" text-[#666666]">메인화면</span>
              </li>
              <li
                onClick={handleCLickCalendar}
                className="mb-4 text-lg flex items-center"
              >
                <img
                  className="w-6 h-6 mx-3"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728129889231.png"
                />
                <span className="mt-1">캘린더</span>
              </li>
            </ul>
          </nav>
          {/* 개인 일정 */}
          <SideTodoSection />
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
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <SettingModal setIsOpen={setIsOpen} />
      </ModalWrapper>

      {/* Main Content */}
      <main className="flex-grow bg-gray-50">{children}</main>
    </div>
  );
};

export default CalendarLayout;
