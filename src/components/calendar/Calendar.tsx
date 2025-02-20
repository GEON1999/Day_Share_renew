import { useEffect, useState } from "react";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import CalendarDateModal from "./CalendarDateModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import { IconNextBig, IconPrevBig } from "@/icons";
import { useModalStore } from "@/store/modalStore";

const generateCalendar = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  // 이전 달의 마지막 날짜 구하기
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

const Calendar = ({}) => {
  const {
    isCalendarDateModalOpen,
    setCalendarDateModalOpen,
    isTodoDetailModalOpen,
    isTodoCreateModalOpen,
  } = useModalStore();
  const router = useRouter();
  const date = useSearch.useSearchDate();
  const calendarId = useSearch.useSearchId();
  const clickedDate = date ? new Date(parseInt(date)) : null;
  const clickedDay = clickedDate ? clickedDate.getDate() : null;
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const calendar = generateCalendar(year, month);

  // calendarDetail을 가져오는 것 보다 100 ~ 200ms 빠른 LCP
  const { data: calendarDate, isLoading } =
    useCalendarQueries.useGetCalendarDates(
      calendarId,
      `timestamp_ms=${date ?? ""}`
    );

  const { data: calendarBasic, isLoading: calendarBasicLoading } =
    useCalendarQueries.useGetCalendarBasic(calendarId);

  useEffect(() => {
    document.title = `Calendar - ${year}-${month + 1}`;
  }, [year, month]);

  const getDayData = (day: number) => {
    // UTC 기준 타임스탬프 생성
    const utcTimestamp = Date.UTC(year, month, day);

    return (
      calendarDate?.dates[utcTimestamp] || {
        diaryCount: 0,
        todoCount: 0,
        todoTitles: [],
      }
    );
  };

  const handleClickDate = (day: number | null) => {
    if (day === null) return;
    setCalendarDateModalOpen(true);
    const ms = new Date(Date.UTC(year, month, day)).getTime();
    router.push(`/calendar/${calendarId}/?date=${ms}`);
  };

  const handlePrevBtn = async () => {
    if (month === 0) {
      await setYear(year - 1);
      await setMonth(11);
    } else {
      await setMonth(month - 1);
    }
    const utcDate = new Date(Date.UTC(year, month - 1, 1));
    const ms = utcDate.getTime();
    router.push(`/calendar/${calendarId}?date=${ms}`);
  };

  const handleNextBtn = async () => {
    if (month === 11) {
      await setYear(year + 1);
      await setMonth(0);
    } else {
      await setMonth(month + 1);
    }
    const utcDate = new Date(Date.UTC(year, month + 1, 1));
    const ms = utcDate.getTime();
    router.push(`/calendar/${calendarId}?date=${ms}`);
  };

  const handleClickToday = () => {
    router.push(`/calendar/${calendarId}?date=${Helper.getTodayMs()}`);
    setYear(today.getFullYear());
    setMonth(today.getMonth());
  };

  return (
    <div
      className={`main_container flex items-center lg:items-start lg:space-x-[70px] py-5 lg:py-0`}
    >
      <div
        className={`w-[300px] h-[500px] lg:w-[631.5px] lg:h-full ${
          isCalendarDateModalOpen ||
          isTodoDetailModalOpen ||
          isTodoCreateModalOpen
            ? "hidden"
            : "block"
        } lg:block`}
      >
        <h1 className="text-xl lg:mt-[54px]">
          {calendarBasic?.name ?? "달력"}
        </h1>
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
        <div className="flex items-center">
          <div className="w-[300px] lg:w-[629px] h-[410px] lg:h-[675px] overflow-hidden border-y-[1.5px] border-y-[#494949]">
            <table className="w-full h-full text-center">
              <thead className="bg_light_pink h-[20px] lg:h-[34px] w-[300px] lg:w-full border-b-[1.5px] ">
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
              <tbody
                className="w-[300px] lg:w-full"
                style={{ borderCollapse: "collapse" }}
              >
                {calendar.map((week, index) => (
                  <tr key={index} className="">
                    {week.map((dateObj, dayIndex) => {
                      if (!dateObj) {
                        return <td key={dayIndex} className="p-0"></td>;
                      }

                      const { day, currentMonth } = dateObj;
                      const isDayCell = currentMonth;
                      let isToday = false;
                      const todayUTC = new Date(
                        Date.UTC(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate()
                        )
                      );

                      if (isDayCell) {
                        const currentDateUTC = new Date(
                          Date.UTC(year, month, dateObj.day)
                        );
                        isToday =
                          currentDateUTC.toISOString() ===
                          todayUTC.toISOString();
                      }

                      const currentDate = new Date(year, month, dateObj.day);
                      const dayData = getDayData(day);
                      const { diaryCount, todoCount, todoTitles } = dayData;

                      const isClicked = clickedDay === day && currentMonth;

                      return (
                        <td
                          key={dayIndex}
                          onClick={() => isDayCell && handleClickDate(day)}
                          className="p-0 space-x-0 space-y-0"
                        >
                          <div
                            className={`mx-auto w-[42.85px] h-[64.5px] lg:w-[89.86px] lg:h-[129px] transition-all duration-300 ease-in-out bor_light_pink border px-1lg:px-2 py-1 cur`}
                          >
                            <div className="flex flex-col items-center justify-center lg:ml-[51px] relative">
                              <span
                                className={`flex items-center justify-center w-[20px] h-[20px] lg:w-[30px] lg:h-[30px] text-[12px] lg:text-[18px] ${
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
                                }`}
                              >
                                {day}
                              </span>
                              <div
                                className={`mt-[2px] ${
                                  diaryCount == 1 && currentMonth
                                    ? "bg_deep_pink"
                                    : ""
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
                                  todoTitles.map(
                                    (title: string, index: number) => {
                                      return todoCount === 1 ? (
                                        <div
                                          key={index}
                                          className="h-[15px] lg:h-[33px] flex"
                                        >
                                          <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
                                          <div className=" bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
                                            {Helper.cutString(title, 5)}
                                          </div>
                                        </div>
                                      ) : todoCount === 2 ? (
                                        index === 0 ? (
                                          <div
                                            key={index}
                                            className="h-[15px] lg:h-[33px] flex"
                                          >
                                            <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
                                            <div className=" bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
                                              {Helper.cutString(title, 5)}
                                            </div>
                                          </div>
                                        ) : (
                                          <div
                                            key={index}
                                            className="h-[15px] lg:h-[33px] hidden lg:flex"
                                          >
                                            <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
                                            <div className=" bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
                                              {Helper.cutString(title, 5)}
                                            </div>
                                          </div>
                                        )
                                      ) : todoCount >= 3 ? (
                                        index === 0 ? (
                                          <div
                                            key={index}
                                            className="h-[15px] lg:h-[33px] flex"
                                          >
                                            <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
                                            <div className=" bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
                                              {Helper.cutString(title, 5)}
                                            </div>
                                          </div>
                                        ) : index === 1 ? (
                                          <div
                                            key={index}
                                            className="h-[15px] lg:h-[33px] hidden lg:flex"
                                          >
                                            <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
                                            <div className=" bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
                                              +{todoCount - 1}
                                            </div>
                                          </div>
                                        ) : null
                                      ) : null;
                                    }
                                  )}
                              </div>
                            </div>
                          </div>
                        </td>
                      );
                    })}
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
