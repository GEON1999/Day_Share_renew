import { IconCamera, IconSelectCheck, IconX } from "@/icons";
import { useState } from "react";

interface CalendarImageSelectProps {
  setIsOpen: (isOpen: boolean) => void;
  setImg: (img: string) => void;
}

const calendarImageData = [
  {
    id: 1,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-1.%E1%84%92%E1%85%AA%E1%84%87%E1%85%AE%E1%86%AB.jpg",
  },
  {
    id: 2,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-4.%E1%84%80%E1%85%A9%E1%86%BC%E1%84%87%E1%85%AE.jpg",
  },
  {
    id: 3,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-3.%E1%84%82%E1%85%A1%E1%86%A9%E1%84%89%E1%85%B5.jpg",
  },
  {
    id: 4,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-2.%E1%84%90%E1%85%A6%E1%84%82%E1%85%B5%E1%84%89%E1%85%B3.jpg",
  },
  {
    id: 5,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-8.%E1%84%83%E1%85%A5%E1%86%B7%E1%84%8B%E1%85%A2%E1%86%AB%E1%84%83%E1%85%A5%E1%84%86%E1%85%A5.jpg",
  },
  {
    id: 6,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-7.%E1%84%92%E1%85%A6%E1%86%AF%E1%84%89%E1%85%B3.jpg",
  },
  {
    id: 7,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-6.%E1%84%88%E1%85%A9%E1%86%B8%E1%84%88%E1%85%A9.jpg",
  },
  {
    id: 8,
    src: "https://s3.ap-northeast-2.amazonaws.com/geon.com/%E1%84%83%E1%85%A1%E1%86%AF%E1%84%85%E1%85%A7%E1%86%A8+%E1%84%8B%E1%85%B5%E1%84%86%E1%85%B5%E1%84%8C%E1%85%B5-5.%E1%84%82%E1%85%A9%E1%86%AF%E1%84%85%E1%85%A1%E1%84%8B%E1%85%AE%E1%86%AF%E1%84%86%E1%85%A1%E1%86%AB%E1%84%8F%E1%85%B3%E1%86%B7.jpg",
  },
];

const CalendarImageSelect = ({
  setIsOpen,
  setImg,
}: CalendarImageSelectProps) => {
  const [calendarImg, setCalendarImg] = useState("");
  const handleImageUpload = () => {
    document.getElementById("imageUpload")?.click();
    setIsOpen(false);
  };
  const handleCancel = () => {
    setCalendarImg("");
    setIsOpen(false);
  };
  const handleImageClick = () => {
    setImg(calendarImg);
    setIsOpen(false);
  };
  return (
    <div className="bor w-[320px] lg:w-[985px] h-[600px] lg:h-[805px] bg_depp rounded-md py-[10px] lg:py-[30px] px-[10px] lg:px-[25px] text-[20px] noto-sans-text ">
      <div
        className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
        onClick={handleCancel}
      >
        <IconX className="w-full h-full" />
      </div>
      <h1 className="-mt-[15px] text-lg font-bold">달력 이미지 변경</h1>
      <div className="flex justify-center flex-wrap gap-[15px] mt-[10px] lg:mt-[25px]">
        <div
          onClick={handleImageUpload}
          className="w-[283.0px] h-[90px] lg:w-[300px] lg:h-[200px] bg-[#D1D3D4] bor rounded-md flex flex-col items-center justify-center cur hover:bg-[#D1D3D480] transition-colors duration-200 ease-in-out"
        >
          <IconCamera className="w-[25px] h-[22.31px] mt-[10px] lg:mt-[32px]" />
          <p className="text-[15px] mt-[3px]">가져오기</p>
        </div>
        {calendarImageData.map((item) => (
          <div className="relative">
            <img
              key={item.id}
              src={item.src}
              className={`w-[135.4px] h-[90px] lg:w-[300px] lg:h-[200px]  rounded-md cur ${
                calendarImg === item.src ? "border-[3px] shadow_box" : "bor"
              }`}
              onClick={() => {
                setCalendarImg(item.src);
              }}
            />
            {calendarImg === item.src && (
              <IconSelectCheck className="w-[20px] h-[20px] absolute top-[13px] right-[13px] " />
            )}
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-[10px] lg:mt-[30px] space-x-[10px] text-[20px]">
        <button
          onClick={handleCancel}
          className="bg-white w-[40px] h-[30px] text-lg lg:w-[60px] lg:h-[35px] bor rounded-md  hover:bg-[#EDEADF]"
        >
          취소
        </button>
        <button
          onClick={handleImageClick}
          className="bg-[#F6BEBE] w-[40px] h-[30px] text-lg lg:w-[60px] lg:h-[35px] bor rounded-md  hover:bg-[#F69D9D]"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CalendarImageSelect;
