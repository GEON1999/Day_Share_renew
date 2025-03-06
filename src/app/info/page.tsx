"use client";

import {
  IconLogoHoriz,
  IconTodoNormal,
  IconComment,
  IconLogo_sm,
} from "@/icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import { infoEmotionData } from "@/app/data/infoEmotionData";
import { TeamData } from "@/app/data/teamData";
import { useAlert } from "@/components/alert/AlertContext";
import { error } from "console";

const Page = () => {
  const { data: session, status } = useSession();
  const { showAlert } = useAlert();
  const router = useRouter();
  const handleStart = () => {
    if (status === "loading") {
      return;
    } else if (status === "authenticated") {
      router.push("/home");
    } else {
      router.push("/login");
    }
  };

  const handleAppStore = () => {
    window.open(
      "https://apps.apple.com/kr/app/dayshare/id6651824394",
      "_blank"
    );
  };

  const handleEmailClick = (email: string, name: string, role: string) => {
    if (email == "") {
      showAlert("이메일이 없습니다.", "error");
    } else {
      window.location.href = `mailto:${email}?subject=안녕하세요,${role} ${name}님에게 문의드립니다.&body=안녕하세요, Day Share ${role} ${name}님에게 문의드립니다.%0A%0A`;
    }
  };

  return (
    <div className="relative flex flex-col items-center min-h-screen noto-sans-text">
      {/* 홈 화면 */}
      <section className="flex flex-col items-center w-full px-4">
        <IconLogoHoriz className="w-[250px] h-[60px] mt-[100px] md:w-[400px] md:h-[90px] lg:w-[570px] lg:h-[130px] lg:mt-[184px]" />
        <div className="text-[28px] md:text-[40px] lg:text-[60px] font-bold mt-[30px] lg:mt-[50px] text-center">
          <h1>
            <span className="bg-[#494949] text-white">DAY SHARE</span>
            <span>는 당신의 하루를</span>
          </h1>
          <h1>소중한 사람과 연결해 줍니다.</h1>
        </div>
        <button
          onClick={handleStart}
          disabled={status === "loading"}
          className={`mt-[40px] lg:mt-[90px] w-[150px] h-[45px] lg:w-[200px] lg:h-[60px] ${
            status === "loading" ? "bg-gray-400" : "bg-[#494949]"
          } text-white rounded-md shadow_box text-[20px] lg:text-[37px] flex items-center justify-center`}
        >
          {status === "loading" ? (
            <>
              <span className="mr-2 inline-block w-4 h-4 lg:w-5 lg:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              로딩중
            </>
          ) : (
            "시작하기"
          )}
        </button>
        <img
          src="/Images/home.png"
          alt="home"
          className="w-full max-w-[800px] lg:max-w-[1600px] mt-[50px] lg:mt-[100px]"
        />
      </section>

      {/* 소개 화면 */}
      <section className="py-[100px] lg:py-[250px] bg-[#F1F1F1] w-full flex flex-col items-center px-4">
        <div className="flex flex-col items-center">
          <IconTodoNormal className="w-[50px] h-[40px] lg:w-[73.08px] lg:h-[56.38px]" />
          <h1 className="text-[28px] lg:text-[40px] font-bold mt-[10px] text-[#494949]">
            일정
          </h1>
          <p className="text-[20px] lg:text-[37px] mt-[15px] lg:mt-[20px] text-center">
            함께 일정을 등록하고 공유하며, 댓글로 소통해보세요!
          </p>
          <img
            src="/Images/todo_example.png"
            alt="todo_example"
            className="w-full max-w-[1420px] mt-[30px] lg:mt-[40px]"
          />
        </div>

        <div className="flex flex-col items-center mt-[100px] lg:mt-[190px]">
          <img
            src="/Images/diary.png"
            alt="diary_icon"
            className="w-[45px] h-[38px] lg:w-[67.79px] lg:h-[56.49px]"
          />
          <h1 className="text-[28px] lg:text-[40px] font-bold mt-[10px] text-[#494949]">
            일기
          </h1>
          <p className="text-[20px] lg:text-[37px] mt-[15px] lg:mt-[20px] text-center">
            함께 쓰고 나누는 일기, 추억까지 함께하세요!
          </p>
          <img
            src="/Images/diary_example.png"
            alt="diary_example"
            className="w-full max-w-[1420px] mt-[30px] lg:mt-[40px]"
          />
        </div>

        <div className="flex flex-col items-center mt-[100px] lg:mt-[190px]">
          <IconComment className="w-[50px] h-[40px] lg:w-[73.08px] lg:h-[56.38px]" />
          <h1 className="text-[28px] lg:text-[40px] font-bold mt-[10px] text-[#494949]">
            채팅
          </h1>
          <p className="text-[20px] lg:text-[37px] mt-[15px] lg:mt-[20px] text-center">
            친구과 실시간으로 대화하며 일정도, 일상도 함께 나누세요
          </p>
          <img
            src="/Images/chat_example.png"
            alt="chat_example"
            className="w-full max-w-[1420px] mt-[30px] lg:mt-[40px]"
          />
        </div>
      </section>

      {/* 소개 화면 2 */}
      <section className="flex flex-col items-center py-[100px] lg:py-[250px] w-full px-4">
        <IconLogo_sm className="w-[60px] h-[60px] lg:w-[100px] lg:h-[100px]" />
        <h1 className="text-[28px] lg:text-[40px] font-bold mt-[10px] text-[#494949] text-center">
          데이메이트와 함께해요!
        </h1>
        <div className="h-[80px] lg:h-[115px] bg-black w-[1px] my-[40px] lg:my-[80px]" />
        <h2 className="text-[28px] lg:text-[40px] font-bold text-center">
          오늘의 감정을 공유해 보세요
        </h2>
        <p className="text-[20px] lg:text-[30px] mt-[10px] text-center">
          오늘의 감정을 귀여운 캐릭터로
        </p>
        <p className="text-[20px] lg:text-[30px] text-center">
          간편하게 기록해 보세요!
        </p>

        <div className="flex flex-wrap justify-center mt-[40px] lg:mt-[70px] gap-4 lg:space-x-[20px]">
          {infoEmotionData.map((emotion: any) => {
            return (
              <div className="flex flex-col items-center transition-transform">
                <img
                  src={emotion.image}
                  alt={emotion.name}
                  className="w-[150px] h-[160px] md:w-[220px] md:h-[230px] lg:w-[280px] lg:h-[290px]"
                />
                <p className="text-[22px] md:text-[28px] lg:text-[37px] mt-[10px] lg:mt-[15px] font-medium">
                  {emotion.name}
                </p>
              </div>
            );
          })}
        </div>

        <div className="h-[80px] lg:h-[115px] bg-black w-[1px] my-[40px] lg:my-[80px]" />
        <h2 className="text-[28px] lg:text-[40px] font-bold text-center">
          데이메이트가 당신의 일기에 공감해요
        </h2>
        <p className="text-[20px] lg:text-[30px] mt-[10px] text-center">
          언제나 데이메이트와 함께하는 특별한 순간
        </p>
        <div className="mt-[30px] lg:mt-[40px] bg-[#FFF5F5] p-4 lg:p-8 rounded-2xl shadow-lg max-w-[1200px] w-full">
          <img
            src="/Images/daymate_example.png"
            alt="daymate_example"
            className="w-full"
          />
        </div>
      </section>

      {/* 앱 소개 */}
      <section className="py-[100px] lg:py-[250px] bg-[#F1F1F1] w-full flex flex-col lg:flex-row justify-center items-center lg:space-x-[80px] px-4">
        <img
          src="/Images/phone.png"
          alt="phone"
          className="h-[400px] lg:h-[900px] mb-[50px] lg:mb-0"
        />
        <div className="flex flex-col items-center lg:items-start">
          <p className="text-[30px] lg:text-[50px] font-bold text-center lg:text-left">
            앱에서도
          </p>
          <p className="text-[30px] lg:text-[50px] font-bold mt-[5px] lg:mt-[10px] text-center lg:text-left">
            <span className="bg-[#494949] text-white">DAY SHARE</span>
            <span> 와</span>
          </p>
          <p className="text-[30px] lg:text-[50px] font-bold text-center lg:text-left">
            함께 할 수 있어요!
          </p>

          <button
            onClick={handleAppStore}
            className="mt-[40px] lg:mt-[70px] w-[250px] h-[50px] lg:w-[370px] lg:h-[60px] bg-[#494949] text-white rounded-md shadow_box text-[22px] lg:text-[37px]"
          >
            App 스토어 바로가기
          </button>
        </div>
      </section>

      {/* 팀원 소개 */}
      <section className="py-[50px] md:py-[80px] lg:py-[100px] bg-[#494949] w-full flex flex-col items-center">
        <h1 className="text-[28px] md:text-[35px] lg:text-[40px] font-bold text-white">
          팀원 소개
        </h1>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-[40px] md:space-y-0 md:space-x-[20px] mt-[40px] md:mt-[60px] lg:mt-[80px] px-4">
          {TeamData.map((team, index) => (
            <div
              key={index}
              className="flex flex-col items-center relative cursor-pointer hover:scale-105 transition-transform duration-300"
              onClick={() =>
                handleEmailClick(team.email ?? "", team.name, team.role)
              }
              aria-label={`${team.name}에게 이메일 보내기`}
              title={`${team.name}에게 이메일 보내기`}
            >
              <div
                className={`status_box transition-colors duration-300 shadow_box w-[280px] h-[300px] md:w-[300px] md:h-[320px] lg:w-[341px] lg:h-[358px] ${team.bg}`}
              >
                <img
                  src={team.image}
                  alt={team.name}
                  className="w-[280px] h-[300px] md:w-[300px] md:h-[320px] lg:w-[341px] lg:h-[358px] absolute top-[20px] md:top-[25px] lg:top-[29px]"
                />
              </div>
              <p
                className={`text-[18px] md:text-[20px] lg:text_xl mt-[15px] ${team.color}`}
              >
                {team.name}
              </p>
              <p className="text-white text-[18px] md:text-[20px] lg:text_xl">
                {team.role}
              </p>
              <p className="text-white text-[14px] md:text-[16px] mt-1 opacity-70">
                {team.email ?? "정보 없음"}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Page;
