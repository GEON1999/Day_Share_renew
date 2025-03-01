import { useEffect, useState, useMemo, useCallback } from "react";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import CalendarDateModal from "./CalendarDateModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import { IconNextBig, IconPrevBig } from "@/icons";
import { useModalStore } from "@/store/modalStore";
import React from "react";

const generateCalendar = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();
  const prevLastDay = new Date(year, month, 0).getDate();

  let day = 1;
  const calendar = [];

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        week.push({
          day: prevLastDay - startingDay + j + 1,
          currentMonth: false,
        });
      } else if (day <= daysInMonth) {
        week.push({ day: day, currentMonth: true });
        day++;
      } else {
        week.push({ day: day - daysInMonth, currentMonth: false });
        day++;
      }
    }
    calendar.push(week);
  }

  return calendar;
};

const CalendarHeader = () => (
  <thead className="bg_light_pink h-[20px] lg:h-[34px] w-[300px] lg:w-full border-b-[1.5px]">
    <tr className="text-black text-[14px] lg:text-md">
      <th className="day-sun">
        <span className="bor_right" />
      </th>
      <th className="day-mon relative">
        <span className="bor_right" />
      </th>
      <th className="day-tue relative">
        <span className="bor_right" />
      </th>
      <th className="day-wed relative">
        <span className="bor_right" />
      </th>
      <th className="day-thu relative">
        <span className="bor_right" />
      </th>
      <th className="day-fri relative">
        <span className="bor_right" />
      </th>
      <th className="day-sat"></th>
    </tr>
  </thead>
);

const TodoItem = React.memo(
  ({
    title,
    isFirst,
    todoCount,
    index,
  }: {
    title: string;
    isFirst: boolean;
    todoCount: number;
    index: number;
  }) => {
    if (
      todoCount === 1 ||
      (todoCount === 2 && index === 0) ||
      (todoCount >= 3 && index === 0)
    ) {
      return (
        <div className="h-[15px] lg:h-[33px] flex">
          <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
          <div className="bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
            {Helper.cutString(title, 5)}
          </div>
        </div>
      );
    }

    if ((todoCount === 2 && index === 1) || (todoCount >= 3 && index === 1)) {
      return (
        <div className="h-[15px] lg:h-[33px] hidden lg:flex">
          <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
          <div className="bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
            {todoCount >= 3 ? `+${todoCount - 1}` : Helper.cutString(title, 5)}
          </div>
        </div>
      );
    }

    return null;
  }
);

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

    const dayData = getDayData(day);
    const { diaryCount, todoCount, todoTitles } = dayData;
    const isClicked = clickedDay === day && currentMonth;

    const dateStyle = `flex items-center justify-center w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] text-[12px] lg:text-[18px] ${
      currentMonth && dayIndex === 0
        ? "text_red"
        : !currentMonth && dayIndex === 0
        ? "text_red opacity-40"
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
                todoCount >= 2
                  ? "top-[44px] lg:top-[52px]"
                  : "top-[44px] lg:top-[90px]"
              }`}
            >
              {currentMonth &&
                todoTitles.map((title: string, index: number) => (
                  <TodoItem
                    key={index}
                    title={title}
                    isFirst={index === 0}
                    todoCount={todoCount}
                    index={index}
                  />
                ))}
            </div>
          </div>
        </div>
      </td>
    );
  }
);

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

const Calendar = () => {
  const {
    isCalendarDateModalOpen,
    setCalendarDateModalOpen,
    isTodoDetailModalOpen,
    isTodoCreateModalOpen,
  } = useModalStore();
  const router = useRouter();
  const date = useSearch.useSearchDate();
  const currentDate = date ? new Date(Number(date)) : null;
  const calendarId = useSearch.useSearchId();
  const clickedDate = date ? new Date(parseInt(date)) : null;
  const clickedDay = clickedDate ? clickedDate.getDate() : null;
  const today = new Date();

  const [year, setYear] = useState(
    currentDate?.getFullYear() ?? today.getFullYear()
  );
  const [month, setMonth] = useState(
    currentDate?.getMonth() ?? today.getMonth()
  );

  const calendar = useMemo(() => generateCalendar(year, month), [year, month]);

  const { data: calendarDate } = useCalendarQueries.useGetCalendarDates(
    calendarId,
    `timestamp_ms=${date ?? ""}`
  );

  const { data: calendarBasic, isLoading: calendarBasicLoading } =
    useCalendarQueries.useGetCalendarBasic(calendarId);

  useEffect(() => {
    document.title = `Calendar - ${year}-${month + 1}`;
  }, [year, month]);

  const getDayData = useCallback(
    (day: number) => {
      const utcTimestamp = Date.UTC(year, month, day);
      return (
        calendarDate?.dates[utcTimestamp] || {
          diaryCount: 0,
          todoCount: 0,
          todoTitles: [],
        }
      );
    },
    [calendarDate, year, month]
  );

  const handleClickDate = useCallback(
    (day: number | null) => {
      if (day === null) return;
      setCalendarDateModalOpen(true);
      const ms = new Date(Date.UTC(year, month, day)).getTime();
      router.push(`/calendar/${calendarId}/?date=${ms}`);
    },
    [year, month, calendarId, setCalendarDateModalOpen, router]
  );

  const handlePrevBtn = useCallback(async () => {
    let newYear = year;
    let newMonth = month;

    if (month === 0) {
      newYear = year - 1;
      newMonth = 11;
    } else {
      newMonth = month - 1;
    }

    setYear(newYear);
    setMonth(newMonth);

    const utcDate = new Date(Date.UTC(newYear, newMonth, 1));
    const ms = utcDate.getTime();
    router.push(`/calendar/${calendarId}?date=${ms}`);
  }, [year, month, calendarId, router]);

  const handleNextBtn = useCallback(async () => {
    let newYear = year;
    let newMonth = month;

    if (month === 11) {
      newYear = year + 1;
      newMonth = 0;
    } else {
      newMonth = month + 1;
    }

    setYear(newYear);
    setMonth(newMonth);

    const utcDate = new Date(Date.UTC(newYear, newMonth, 1));
    const ms = utcDate.getTime();
    router.push(`/calendar/${calendarId}?date=${ms}`);
  }, [year, month, calendarId, router]);

  const handleClickToday = useCallback(() => {
    router.push(`/calendar/${calendarId}?date=${Helper.getTodayMs()}`);
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  }, [calendarId, router, today]);

  const isMainContainerVisible = useMemo(
    () =>
      !(
        isCalendarDateModalOpen ||
        isTodoDetailModalOpen ||
        isTodoCreateModalOpen
      ),
    [isCalendarDateModalOpen, isTodoDetailModalOpen, isTodoCreateModalOpen]
  );

  return (
    <div className="main_container flex items-center lg:items-start lg:space-x-[70px] py-5 lg:py-0">
      <div
        className={`w-[300px] h-[500px] lg:w-[631.5px] lg:h-full ${
          isMainContainerVisible ? "block" : "hidden"
        } lg:block`}
      >
        <h1 className="text_xl lg:mt-[54px]">
          {calendarBasic?.name ?? "달력"}
        </h1>

        <CalendarNavigation
          year={year}
          month={month}
          handleClickToday={handleClickToday}
          handlePrevBtn={handlePrevBtn}
          handleNextBtn={handleNextBtn}
        />

        <div className="flex items-center">
          <div className="w-[300px] lg:w-[629px] h-[410px] lg:h-[675px] overflow-hidden border-y-[1.5px] border-y-[#494949]">
            <table className="w-full h-full text-center">
              <CalendarHeader />
              <tbody
                className="w-[300px] lg:w-full"
                style={{ borderCollapse: "collapse" }}
              >
                {calendar.map((week, index) => (
                  <tr key={index}>
                    {week.map((dateObj, dayIndex) => (
                      <CalendarCell
                        key={dayIndex}
                        dateObj={dateObj}
                        dayIndex={dayIndex}
                        year={year}
                        month={month}
                        today={today}
                        handleClickDate={handleClickDate}
                        clickedDay={clickedDay}
                        getDayData={getDayData}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div
        className={`lg:block ${
          isCalendarDateModalOpen ||
          isTodoCreateModalOpen ||
          isTodoDetailModalOpen
            ? "block"
            : "hidden"
        }`}
      >
        <CalendarDateModal />
      </div>
    </div>
  );
};

export default Calendar;
