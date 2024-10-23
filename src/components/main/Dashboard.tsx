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
      <img
        className={` object-cover rounded-xl border-2 ${
          isEditMode
            ? "cursor-move w-20 h-20"
            : "cursor-pointer w-[210px] h-[210px]"
        }`}
        src={calendar.img}
      />
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
  const currentTodoPage = useSearch.useSearchTodoPage();
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
  console.log("favoriteTodoData", favoriteTodoData);

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

  const handleDiaryPrevBtn = () => {
    if (currentDiaryPage === "1") return;
    params.set("diary_page", String(Number(currentDiaryPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleDiaryNextBtn = () => {
    if (diaryData?.total_count <= Number(currentDiaryPage) * 5) return;
    params.set("diary_page", String(Number(currentDiaryPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  return (
    <div className="main_container">
      {/* 인사말 */}
      <div className="mt-10">
        <h1 className="text-[40px] font-semibold">안녕하세요, 박건님.</h1>
        {favoriteTodoData?.title ? (
          <p className="text-[40px]">
            주요 일정은{" "}
            <span className="font-bold text-red-500 bg_hilight p-1">
              {favoriteTodoData?.title}
            </span>
            입니다.
          </p>
        ) : (
          <p className="text-[40px]">주요 일정을 설정해 보세요!</p>
        )}
      </div>

      <div className="flex space-x-10 mt-20 w-full items-strat">
        {/* 오늘 감정 */}
        <section className="w-[250px] h-[400px]">
          <h2 className="text-[35px] font-bold mb-2">오늘 감정</h2>
          <img
            className="h-[300px]"
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727867614611.jpg"
          />
        </section>

        {/* 공유 일기 */}
        <section className="w-[800px] h-[400px]">
          <div className="flex justify-between">
            <h2 className="text-[35px] font-bold mb-2">공유 일기</h2>
            <div className="flex mt-3">
              <img
                onClick={handleDiaryPrevBtn}
                className="w-12px h-8 cur"
                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728627561682.jpg"
              />
              <img
                onClick={handleDiaryNextBtn}
                className="w-12px h-8 cur"
                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728627525256.jpg"
              />
            </div>
          </div>
          {diaryData && (
            <ul className="bg-[#F0DACC] px-4 border-[3px] rounded-xl">
              {diaryData?.diaries?.map((diary: any, idx: number) => (
                <li
                  onClick={() => {
                    handleClickDiary(diary.calendarId, diary.id);
                  }}
                  key={diary.id}
                  className={`p-4 bg-transparent items-center border-b cur ${
                    idx === 4 ? "border-b-0" : ""
                  }`}
                >
                  <span>{diary.title}</span>
                  <span className="text-sm text-gray-500">{diary.author}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* 공유 달력 */}
      <section>
        <div className="flex justify-between w-[1120px] items-center">
          <h2 className="text-[35px] font-bold mb-2 mt-10">공유 달력</h2>
          <div className="flex items-center mt-10 space-x-4">
            <button
              onClick={handleAddBtn}
              className="text-[#E0CBB7] font-bold text-[50px] rounded-full w-8 h-8 mt-1 bg-black flex justify-center items-center"
            >
              <span>+</span>
            </button>
            {!isEditMode && (
              <div className="flex items-center">
                <img
                  onClick={handlePrevBtn}
                  className="w-12px h-8 cur"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728627561682.jpg"
                />
                <img
                  onClick={handleNextBtn}
                  className="w-12px h-8 cur"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728627525256.jpg"
                />
              </div>
            )}
            <button
              onClick={handleSaveOrder}
              className="p-2 bg_deeper bor text-white rounded"
            >
              {isEditMode ? "수정 완료" : "순서 변경"}
            </button>
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
