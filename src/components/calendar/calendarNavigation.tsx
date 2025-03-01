import { IconNextBig, IconPrevBig } from "@/icons";

const CalendarNavigation = ({
  year,
  month,
  handleClickToday,
  handlePrevBtn,
  handleNextBtn,
}: {
  year: number;
  month: number;
  handleClickToday: () => void;
  handlePrevBtn: () => void;
  handleNextBtn: () => void;
}) => (
  <div className="flex justify-between w-[300px] lg:w-[1255px] mb-2">
    <div className="flex w-[300px] lg:w-[626px] items-center space-x-4 justify-between">
      <span className="text-[30px] lg:text-[46px] lg:-mt-[10px]">
        {year}. {month + 1}
      </span>
      <div className="flex items-center ">
        <button
          onClick={handleClickToday}
          className="lg:block hidden w-[109px] h-[34px] text-[20px] bor rounded-full mr-6 btn_transparent"
        >
          TODAY
        </button>
        <button
          onClick={handleClickToday}
          className="lg:hidden flex justify-center items-center w-[30px] h-[30px] text-[20px] border-[0.8px] border-[#49494950] rounded-full btn_transparent mr-[20px]"
        >
          T
        </button>
        <div className="flex items-center space-x-[10px] lg:space-x-[34px]">
          <IconPrevBig
            onClick={handlePrevBtn}
            className="w-[10px] h-[20px] lg:w-[12.5px] lg:h-[25px] cur"
          />
          <IconNextBig
            onClick={handleNextBtn}
            className="w-[10px] h-[20px] lg:w-[12.5px] lg:h-[25px] cur"
          />
        </div>
      </div>
    </div>
  </div>
);

export default CalendarNavigation;
