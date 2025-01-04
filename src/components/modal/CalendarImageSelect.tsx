import { IconCamera, IconX } from "@/icons";
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
    <div className="bor w-[520px] h-[490px] bg_depp rounded-md p-[20px] text-[20px] noto-sans-text text-[#494949]">
      <div
        className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
        onClick={handleCancel}
      >
        <IconX className="w-full h-full" />
      </div>
      <h1 className="-mt-[10px] font-bold">달력 이미지 변경</h1>
      <div className="flex flex-wrap gap-[10px] mt-[25px]">
        <div
          onClick={handleImageUpload}
          className="w-[150px] h-[100px] bg-[#D1D3D4] bor rounded-md flex flex-col items-center cur"
        >
          <IconCamera className="w-[25px] h-[22.31px] mt-[32px]" />
          <p className="text-[15px] mt-[3px]">가져오기</p>
        </div>
        {calendarImageData.map((item) => (
          <img
            key={item.id}
            src={item.src}
            className={`w-[150px] h-[100px]  rounded-md cur ${
              calendarImg === item.src ? "border-4 border-[#F6BEBE]" : "bor"
            }`}
            onClick={() => {
              setCalendarImg(item.src);
            }}
          />
        ))}
      </div>
      <div className="flex justify-center mt-[30px] space-x-[10px] text-[20px]">
        <button
          onClick={handleCancel}
          className="bg-white w-[60px] h-[35px] bor rounded-md text-[#494949] hover:bg-[#EDEADF]"
        >
          취소
        </button>
        <button
          onClick={handleImageClick}
          className="bg-[#F6BEBE] w-[60px] h-[35px] bor rounded-md text-[#494949] hover:bg-[#F69D9D]"
        >
          확인
        </button>
      </div>
    </div>
  );
};

export default CalendarImageSelect;
