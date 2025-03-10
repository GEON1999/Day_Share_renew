import TodoItem from "@/components/calendar/todoItem";
import React from "react";
import Helper from "@/helper/Helper";

// 공휴일 인터페이스 정의
interface Holiday {
  date: string;
  name: string;
}

const CalendarCell = React.memo(
  ({
    dateObj,
    dayIndex,
    year,
    month,
    today,
    handleClickDate,
    clickedDay,
    getDayData,
    holidays,
  }: any) => {
    if (!dateObj) return <td key={dayIndex} className="p-0"></td>;

    const { day, currentMonth } = dateObj;
    const isDayCell = currentMonth;

    const todayUTC = new Date(
      Date.UTC(today.getFullYear(), today.getMonth(), today.getDate())
    );

    let isToday = false;
    if (isDayCell) {
      const currentDateUTC = new Date(Date.UTC(year, month, dateObj.day));
      isToday = currentDateUTC.toISOString() === todayUTC.toISOString();
    }

    // 공휴일 확인
    const currentDateString = `${year}-${String(month + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const holiday = holidays?.find(
      (h: Holiday) => h.date === currentDateString
    );
    const isHolidayDate = !!holiday;

    const dayData = getDayData(day);
    const { diaryCount, todoCount, todoTitles } = dayData;
    const isClicked = clickedDay === day && currentMonth;
    const koreanHoliday = Helper.getKoreanHolidays(holiday?.name);

    const combinedTitles = [
      ...(isHolidayDate && holiday
        ? [{ title: koreanHoliday, isHoliday: true }]
        : []),
      ...todoTitles.map((title: string) => ({ title, isHoliday: false })),
    ];

    const displayTitles = combinedTitles.slice(0, 2);
    const totalCount = combinedTitles.length;

    const dateStyle = `flex items-center justify-center w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] text-[12px] lg:text-[18px] ${
      currentMonth && (dayIndex === 0 || isHolidayDate)
        ? "text-[#E55A5A]"
        : !currentMonth && (dayIndex === 0 || isHolidayDate)
        ? "text-[#E55A5A] opacity-40"
        : !currentMonth && dayIndex !== 0
        ? "opacity-40"
        : ""
    } ${
      isToday
        ? " bg-[#494949] rounded-full text-white"
        : isClicked
        ? " bg-[#FFBDBD80] rounded-full"
        : ""
    }`;

    return (
      <td
        key={dayIndex}
        onClick={() => isDayCell && handleClickDate(day)}
        className="p-0 space-x-0 space-y-0"
      >
        <div className="mx-auto w-[42.85px] h-[64.5px] lg:w-[89.86px] lg:h-[129px] transition-all duration-300 ease-in-out bor_light_pink border px-1lg:px-2 py-1 cur">
          <div className="flex flex-col items-center justify-center lg:ml-[51px] relative">
            <span className={dateStyle}>{day}</span>
            <div
              className={`mt-[2px] ${
                diaryCount === 1 && currentMonth ? "bg_deep_pink" : ""
              } w-1 h-1 rounded-full`}
            ></div>
            <div
              className={`absolute w-[42.85px] lg:w-[89.86px] overflow-hidden -right-[0px] space-y-[5px] text-left text-[10px] lg:text-[13px] text-[#E55A5A] noto-sans-text ${
                totalCount >= 2
                  ? "top-[44px] lg:top-[52px]"
                  : "top-[44px] lg:top-[90px]"
              }`}
            >
              {currentMonth &&
                displayTitles.map(
                  (
                    item: { title: string; isHoliday: boolean },
                    index: number
                  ) => (
                    <TodoItem
                      key={index}
                      title={item.title}
                      isFirst={index === 0}
                      todoCount={totalCount}
                      index={index}
                      isHoliday={item.isHoliday}
                    />
                  )
                )}
            </div>
          </div>
        </div>
      </td>
    );
  }
);

export default CalendarCell;
