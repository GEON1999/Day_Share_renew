"use client";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useUserQueries from "@/queries/user/useUserQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalWrapper from "../modal/ModalWrapper";
import AddCalendarModal from "../modal/AddCalendar";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const queries = useSearch.useSearchQueries();
  const { data: diaryData, isLoading: diaryIsLoading } =
    useUserQueries.useGetUserDiaries("page=1");
  const { data: todoData, isLoading: todoIsLoading } =
    useUserQueries.useGetUserTodos("page=1");
  const randomTodo =
    todoData?.todos[Math.floor(Math.random() * todoData?.todos.length ?? 1)];

  const { data: calendarData, isLoading: calendarIsLoading } =
    useCalendarQueries.useGetCalendarList(queries ?? "");

  const handleClickDiary = (calId: number, diaryId: number) => {
    router.push(`/calendar/${calId}/diary/${diaryId}`);
  };

  const handleClickCalendar = (id: number) => {
    router.push(`/calendar/${id}`);
  };

  const handleAddBtn = () => setIsOpen(true);

  return (
    <div className="main_container">
      {/* Greeting */}
      <div className="mt-10">
        <h1 className="text-[40px] font-semibold">안녕하세요, 박건님.</h1>
        {randomTodo?.title ? (
          <p className="text-[40px]">
            오늘의 주요 일정은{" "}
            <span className="font-bold text-red-500 bg-yellow-300 p-1 rounded">
              {randomTodo?.title}
            </span>
            이에요!
          </p>
        ) : (
          <p className="text-[40px]">오늘은 일정이 없어요!</p>
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
          <h2 className="text-[35px] font-bold mb-2">공유 일기</h2>
          <ul className=" bg-[#F0DACC] px-4 border-[3px] rounded-xl">
            {diaryData?.diaries?.map((diary: any, idx: number) => (
              <li
                onClick={() => {
                  handleClickDiary(diary.calendarId, diary.id);
                }}
                key={diary.id}
                className={`p-4 bg-transparent items-center border-b cur ${idx === 4 ? "border-b-0" : ""}`}
              >
                <span>{diary.title}</span>
                <span className="text-sm text-gray-500">{diary.author}</span>
              </li>
            ))}
          </ul>
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
            <img
              className="w-12px h-8 "
              src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727869920467.jpg"
            />
          </div>
        </div>
        <div className="flex space-x-4">
          {calendarData?.calendars?.map((calendar: any) => (
            <div
              onClick={() => {
                handleClickCalendar(calendar.id);
              }}
              key={calendar.id}
              className="cur flex flex-col items-center justify-center"
            >
              <img
                className="w-[210px] h-[210px] object-cover rounded-xl border-2"
                src={calendar.img}
              />
              <h3 className="mt-2">{calendar.name}</h3>
            </div>
          ))}
        </div>
      </section>
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <AddCalendarModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </div>
  );
};

export default Dashboard;
