"use client";

import {
  IconLogoHoriz,
  IconTodo,
  IconTodoNormal,
  IconDiaryNormal,
  IconComment,
  IconLogo_sm,
} from "@/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { infoEmotionData } from "../data/infoEmotionData";

const Page = () => {
  const { data: session, status } = useSession();

  const router = useRouter();
  const handleStart = () => {
    if (status === "authenticated") {
      if (session) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    }
  };

  const handleAppStore = () => {
    window.open(
      "https://apps.apple.com/kr/app/dayshare/id6651824394",
      "_blank"
    );
  };

  return (
    <div className="relative flex flex-col items-center h-screen noto-sans-text">
      {/* 홈 화면 */}
      <section className="flex flex-col items-center">
        <IconLogoHoriz className="w-[570px] h-[130px] mt-[184px]" />
        <div className="text-[60px] font-bold mt-[50px] text-center">
          <h1>
            <span className="bg-[#494949] text-white px-[10px]">DAY SHARE</span>
            <span> 는 당신의 하루를</span>
          </h1>
          <h1>소중한 사람과 연결해 줍니다.</h1>
        </div>
        <button
          onClick={handleStart}
          className="mt-[90px] w-[200px] h-[60px] bg-[#494949] text-white rounded-md shadow_box text-[37px]"
        >
          시작하기
        </button>
        <img src="/images/home.png" alt="home" className=" mt-[100px]" />
      </section>
      {/* 소개 화면 */}
      <section className="py-[250px] bg-[#F1F1F1] w-full flex flex-col items-center">
        <div className="flex flex-col items-center">
          <IconTodoNormal className="w-[73.08px] h-[56.38px]" />
          <h1 className="text-[40px] font-bold mt-[10px] text-[#494949]">
            일정
          </h1>
          <p className="text-[37px] mt-[20px]">
            함께 일정을 등록하고 공유하며, 댓글로 소통해보세요!
          </p>
          <img
            src="/images/todo_example.png"
            alt="todo_example"
            className=" mt-[40px] w-[1420px]"
          />
        </div>
        <div className="flex flex-col items-center mt-[190px]">
          <img
            src="/images/diary.png"
            alt="diary_icon"
            className="w-[67.79px] h-[56.49px]"
          />
          <h1 className="text-[40px] font-bold mt-[10px] text-[#494949]">
            일기
          </h1>
          <p className="text-[37px] mt-[20px]">
            함께 쓰고 나누는 일기, 추억까지 함께하세요!
          </p>
          <img
            src="/images/todo_example.png"
            alt="diary_example"
            className=" mt-[40px] w-[1420px]"
          />
        </div>
        <div className="flex flex-col items-center mt-[190px]">
          <IconComment className="w-[73.08px] h-[56.38px]" />
          <h1 className="text-[40px] font-bold mt-[10px] text-[#494949]">
            채팅
          </h1>
          <p className="text-[37px] mt-[20px]">
            친구과 실시간으로 대화하며 일정도, 일상도 함께 나누세요
          </p>
          <img
            src="/images/chat_example.png"
            alt="chat_example"
            className=" mt-[40px] w-[1420px]"
          />
        </div>
      </section>
      {/* 소개 화면 2 */}
      <section className="flex flex-col items-center py-[250px] w-full">
        <IconLogo_sm className="w-[100px] h-[100px]" />
        <h1 className="text-[40px] font-bold mt-[10px] text-[#494949]">
          데이메이트와 함께해요!
        </h1>
        <div className="h-[115px] bg-black w-[1px] my-[80px]" />
        <h2 className="text-[40px] font-bold highlight-text px-[15px]">
          오늘의 감정을 공유해 보세요
        </h2>
        <p className="text-[30px] mt-[10px]">오늘의 감정을 귀여운 캐릭터로</p>
        <p className="text-[30px]">간편하게 기록해 보세요!</p>
        <div className="flex  items-center mt-[70px] space-x-[20px]">
          {infoEmotionData.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-[341.13px] h-[358px]"
              />
              <p className="text-[37px] mt-[5px]">{item.name}</p>
            </div>
          ))}
        </div>
        <div className="h-[115px] bg-black w-[1px] my-[80px]" />
        <h2 className="text-[40px] font-bold highlight-text px-[15px]">
          댓글 방지 위원회에서 왔습니다
        </h2>
        <p className="text-[30px] mt-[10px]">언제나 데이메이트와 함께해요!</p>
        <img
          src="/images/daymate_example.png"
          alt="daymate_example"
          className="mt-[65px]"
        />
      </section>
      {/* 앱 소개 */}
      <section className="py-[250px] bg-[#F1F1F1] w-full flex justify-center items-center space-x-[80px]">
        <img src="/images/phone.png" alt="phone" className="h-[900px]" />
        <div className="flex flex-col">
          <p className="text-[60px] font-bold">앱에서도</p>
          <p className="text-[60px] font-bold mt-[10px]">
            <span className="bg-[#494949] text-white px-[10px]">DAY SHARE</span>
            <span> 와</span>
          </p>
          <p className="text-[60px] font-bold">함께 할 수 있어요!</p>

          <button
            onClick={handleAppStore}
            className="mt-[120px] w-[370px] h-[60px] bg-[#494949] text-white rounded-md shadow_box text-[37px]"
          >
            App 스토어 바로가기
          </button>
          {/* <button className="mt-[22px] w-[370px] h-[60px] bg-[#494949] text-white rounded-md shadow_box text-[37px]">
            Play 스토어 바로가기
          </button> */}
        </div>
      </section>
      {/* 팀원 소개 */}
      {/* <section className="py-[100px] bg-[#494949] w-full flex flex-col items-center">
        <h1 className="text-[40px] font-bold text-white">팀원 소개</h1>
        <img src="/images/team.png" alt="team" className="" />
        
      </section> */}
    </div>
  );
};

export default Page;
