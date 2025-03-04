"use client";

import { IconLogoHoriz } from "@/icons";

const Page = () => {
  return (
    <div className="relative flex flex-col items-center h-screen noto-sans-text">
      <section className="flex flex-col items-center">
        <IconLogoHoriz className="w-[570px] h-[130px] mt-[184px]" />
        <div className="text-[60px] font-bold mt-[50px] text-center">
          <h1>
            <span className="bg-[#494949] text-white">DAY SHARE</span>
            <span>는 당신의 하루를</span>
          </h1>
          <h1>소중한 사람과 연결해 줍니다.</h1>
        </div>
        <button className="mt-[90px] w-[200px] h-[60px] bg-black text-white rounded-md shadow_box text-[35px]">
          시작하기
        </button>
        <img src="/images/home.png" alt="info_1" className=" mt-[100px]" />
      </section>
    </div>
  );
};

export default Page;
