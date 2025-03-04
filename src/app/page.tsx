"use client";
import { useState } from "react";
import { IconNext } from "@/icons";
import { useRouter } from "next/navigation";
import { slideData } from "@/app/data/slideData";
import { useSession } from "next-auth/react";

const Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slideData.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slideData.length - 1 ? 0 : prev + 1));
  };

  const handleStart = () => {
    if (status === "authenticated") {
      if (session) {
        router.push("/home");
      } else {
        router.push("/login");
      }
    }
  };

  const handlePreview = () => {
    router.push("/info");
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg_depp">
      <div className="flex items-center justify-between w-[380px] lg:w-[1335px]">
        <button onClick={prevSlide} className="">
          <IconNext className="w-5 h-5 lg:w-6 lg:h-6 transform rotate-180" />
        </button>
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slideData.map((slide, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-center w-full flex-shrink-0 text-center"
              >
                <img
                  src={slide.img}
                  alt={slide.alt}
                  className={`mx-auto ${idx == 1 ? "mb-[20px]" : ""}`}
                />
                <h1 className="noto-sans-text text-[22px] lg:text-[50px] font-black">
                  {slide.title}
                </h1>
                <p className="noto-sans-text text-[18px] lg:text-[25px] font-medium mt-1">
                  {slide.text}
                </p>
              </div>
            ))}
          </div>
        </div>
        <button onClick={nextSlide} className="">
          <IconNext className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
      </div>
      <div className="flex items-center justify-center gap-[15px] mt-5">
        {slideData.map((_, idx) => (
          <div
            key={idx}
            className={`w-[8px] h-[8px] lg:w-[11px] lg:h-[11px] rounded-full ${
              currentSlide === idx ? "bg-[#494949]" : "bg-[#494949]/50"
            }`}
          />
        ))}
      </div>
      <div className="flex items-center justify-center gap-[15px] mt-5">
        <button
          onClick={handleStart}
          className="w-[200px] h-[40px] lg:w-[276px] lg:h-[50px] lg:mt-16 text_lg bg-[#494949] rounded-full text-white font-black noto-sans-text mt-14"
        >
          시작하기
        </button>
        <button
          onClick={handlePreview}
          className="w-[200px] h-[40px] lg:w-[276px] lg:h-[50px] lg:mt-16 text_lg bg-[#ffffff] rounded-full text-[#494949] font-black noto-sans-text mt-14"
        >
          미리보기
        </button>
      </div>
    </div>
  );
};

export default Page;
