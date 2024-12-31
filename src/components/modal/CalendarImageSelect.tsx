import { IconCamera, IconX } from "@/icons";

interface CalendarImageSelectProps {
  setIsOpen: (isOpen: boolean) => void;
  setImg: (img: string) => void;
}

const CalendarImageSelect = ({
  setIsOpen,
  setImg,
}: CalendarImageSelectProps) => {
  const handleImageUpload = () => {
    document.getElementById("imageUpload")?.click();
    setIsOpen(false);
  };
  const handleCancel = () => setIsOpen(false);
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
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
        <div className="w-[150px] h-[100px] bg-white bor rounded-md cur"></div>
      </div>
      <div className="flex justify-center mt-[30px] space-x-[10px] text-[20px]">
        <button
          onClick={handleCancel}
          className="bg-white w-[60px] h-[35px] bor rounded-md text-[#494949] hover:bg-[#EDEADF]"
        >
          취소
        </button>
        <button className="bg-[#F6BEBE] w-[60px] h-[35px] bor rounded-md text-[#494949] hover:bg-[#F69D9D]">
          확인
        </button>
      </div>
    </div>
  );
};

export default CalendarImageSelect;
