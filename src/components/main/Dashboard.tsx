// Dashboard.tsx

"use client";
import React, { useState, useEffect, useRef } from "react";
import { useDrag, useDrop, DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useUserQueries from "@/queries/user/useUserQueries";
import useUserMutations from "@/queries/user/useUserMutations";
import { usePathname, useRouter } from "next/navigation";
import ModalWrapper from "../modal/ModalWrapper";
import AddCalendarModal from "../modal/AddCalendar";
import { useMutation } from "@tanstack/react-query";
import DiaryPagination from "../pagination/diaryPagination";
import CalendarPagination from "../pagination/calendarPagination";

const ITEM_TYPE = "CALENDAR";

const CalendarItem = ({
  calendar,
  index,
  moveCalendar,
  handleClickCalendar,
  isEditMode,
}: any) => {
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: isEditMode, // 수정 모드일 때만 드래그 가능
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: () => isEditMode, // 수정: 함수로 변경하여 오류 해결
    hover: (draggedItem: any) => {
      if (!ref.current) return;
      const draggedIndex = draggedItem.index;
      const hoverIndex = index;
      if (draggedIndex === hoverIndex) return;
      moveCalendar(draggedIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  useEffect(() => {
    if (isEditMode) {
      drag(drop(ref));
    }
  }, [isEditMode, drag, drop]);

  return (
    <div
      ref={ref}
      className="cur flex flex-col items-center justify-center"
      style={{ opacity: isEditMode && isDragging ? 0.5 : 1 }}
      onClick={() => !isEditMode && handleClickCalendar(calendar.id)}
    >
      <div className="shadow_box rounded-md">
        <img
          className={`object-cover rounded-md bor ${
            isEditMode
              ? "cursor-move w-20 h-20"
              : "cursor-pointer w-[300px] h-[200px]"
          }`}
          src={calendar.img}
        />
      </div>
      <div className="flex items-center space-x-1 mt-2">
        <h3 className="">{calendar.name}</h3>
        {calendar.isRead ? null : (
          <div className="w-6 h-6 bg-[#EF6565] rounded-full text-white text-3xl flex items-center justify-center overflow-hidden">
            <span className="transform scale-75 leading-none">N</span>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentPage = useSearch.useSearchPage();
  const currentDiaryPage = useSearch.useSearchDiaryPage();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const router = useRouter();

  const { data: diaryData } = useUserQueries.useGetUserDiaries(
    `diary_page=${currentDiaryPage}`
  );
  const { data: calendarData } = useCalendarQueries.useGetCalendarList(
    isEditMode ? `isAll=true` : `page=${currentPage}`
  );
  const { data: favoriteTodoData } = useUserQueries.useGetUserFavoriteTodo();

  const { mutate: updateUserCalendarOrder } = useMutation({
    mutationFn: useUserMutations.updateUserCalendarOrder,
  });

  const [calendars, setCalendars] = useState<any[]>(
    calendarData?.calendars || []
  );

  useEffect(() => {
    if (calendarData?.calendars) {
      setCalendars(calendarData.calendars);
    }
  }, [calendarData]);

  const moveCalendar = (fromIndex: number, toIndex: number) => {
    const updatedCalendars = [...calendars];
    const [movedCalendar] = updatedCalendars.splice(fromIndex, 1);
    updatedCalendars.splice(toIndex, 0, movedCalendar);
    setCalendars(updatedCalendars);
  };

  const handleSaveOrder = async () => {
    if (isEditMode) {
      const orders = calendars.map((calendar) => calendar.id);
      updateUserCalendarOrder(
        { orders }, // 서버에서 orders를 리스트로 받도록 수정
        {
          onSuccess: () => {
            alert("순서가 저장되었습니다.");
            setIsEditMode(false);
          },
          onError: () => {
            alert("순서 저장에 실패했습니다.");
          },
        }
      );
    } else {
      setIsEditMode(true);
    }
  };

  const handleClickDiary = (calId: number, diaryId: number) => {
    router.push(`/calendar/${calId}/diary/${diaryId}`);
  };

  const handleClickCalendar = (id: number) => {
    router.push(`/calendar/${id}`);
  };

  const handleAddBtn = () => setIsOpen(true);

  const handlePrevBtn = () => {
    if (currentPage === "1") return;
    params.set("page", String(Number(currentPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleNextBtn = () => {
    if (calendarData?.total_calendars <= Number(currentPage) * 5) return;
    params.set("page", String(Number(currentPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="main_container">
      {/* 인사말 */}
      <div className="mt-[33px]">
        <h1 className="text-[50px]">안녕하세요, 박건님.</h1>
        {favoriteTodoData?.title ? (
          <p className="text-[50px]">
            주요 일정은{" "}
            <span className="text-red-500 bg_hilight p-1">
              {favoriteTodoData?.title}
            </span>
            입니다.
          </p>
        ) : (
          <p className="text-[40px]">주요 일정을 설정해 보세요!</p>
        )}
      </div>

      <div className="flex space-x-10 mt-[111px] w-full items-strat">
        {/* 오늘 감정 */}
        <section className="flex flex-col items-center w-[256px]">
          <h2 className="dashboard_title">오늘 감정</h2>
          {/* <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024173250_29c9e08c355745e29901c4dcfa2e96e4.png"></img> */}

          <img
            className=""
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024173625_b47e0565a38843718014a15c2691f1b0.png"
          />
        </section>

        {/* 공유 일기 */}
        <section className="">
          <div className="flex justify-between">
            <h2 className="dashboard_title">공유 일기</h2>
            <DiaryPagination total_count={diaryData?.total_count} />
          </div>
          {diaryData ? (
            <ul className="bg-[#F9F4CF] px-[10px] bor rounded-md w-[950px] h-[270px] shadow_box">
              {diaryData?.diaries?.map((diary: any, idx: number) => (
                <li
                  onClick={() => {
                    handleClickDiary(diary.calendarId, diary.id);
                  }}
                  key={diary.id}
                  className={`px-[6px] bg-transparent items-center flex justify-between h-[67.5px] text-[23px] cur ${
                    idx === 4 || idx === 3
                      ? "border-b-[0px]"
                      : "border-b-[1.5px] border-[#494949]"
                  }`}
                >
                  <span>{diary.title}</span>
                  <span className="text-sm text-gray-500">박건</span>
                </li>
              ))}
            </ul>
          ) : (
            <img
              className="bor rounded-md bg-[#F9F4CF] shadow_box "
              src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024150301_23db0106b82f4323b8f03cef66282fe7.png"
            />
          )}
        </section>
      </div>

      {/* 공유 달력 */}
      <section>
        <div className="flex justify-between w-[1260px] items-center mt-[47px]">
          <div className="flex items-center mb-[17px] space-x-1">
            <h2 className="text-[30px]">공유 달력</h2>
            <img
              onClick={handleAddBtn}
              className="cur"
              src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183542_8e6784334f79491988810457d2b5eb6a.png"
            />
          </div>
          <div className="flex items-center justify-between space-x-4">
            <button
              onClick={handleSaveOrder}
              className="p-2 bg_hilight bor rounded"
            >
              {isEditMode ? "수정 완료" : "순서 변경"}
            </button>
            {!isEditMode && (
              <CalendarPagination total_count={calendarData?.total_calendars} />
            )}
          </div>
        </div>

        <DndProvider backend={HTML5Backend}>
          <div className="flex space-x-4">
            {(isEditMode ? calendars : calendars.slice(0, 5)).map(
              (calendar, index) => (
                <CalendarItem
                  key={calendar.id}
                  calendar={calendar}
                  index={index}
                  moveCalendar={moveCalendar}
                  handleClickCalendar={handleClickCalendar}
                  isEditMode={isEditMode}
                />
              )
            )}
          </div>
        </DndProvider>
      </section>
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <AddCalendarModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </div>
  );
};

export default Dashboard;
