import { dodum } from "@/app/fonts";
import { useEffect, useState } from "react";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import CalendarDateModal from "./CalendarDateModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import { IconNext, IconPrev } from "@/icons";

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

    if (day > daysInMonth) break;
  }

  return calendar;
};

const Calendar = ({}) => {
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
    useCalendarQueries.useGetCalendarDates(calendarId);

  // const { data: calendarDetail } =
  //   useCalendarQueries.useGetCalendarDetail(calendarId);

  // console.log("calendarDetail", calendarDetail, "calendarDate", calendarDate);

  useEffect(() => {
    document.title = `Calendar - ${year}-${month + 1}`;
  }, [year, month]);

  const dateSet = new Set(
    calendarDate?.dates.map((timestamp: any) => {
      const date = new Date(Number(timestamp));
      return date.toISOString().split("T")[0];
    }) || []
  );

  const handleClickDate = (day: number | null) => {
    if (day === null) return;
    const ms = new Date(year, month, day).getTime();
    router.push(`/calendar/${calendarId}/?date=${ms}`);
  };

  const handlePrevBtn = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextBtn = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const handleClickToday = () =>
    router.push(`/calendar/${calendarId}?date=${Helper.getTodayMs()}`);

  return (
    <div className={`main_container flex space-x-[70px] ${dodum.className}`}>
      <div className="w-[631.5px]">
        <h1 className="text-[25px] mt-[75px]">
          {calendarDate?.calendar?.name ?? ""}
        </h1>
        <div className="flex justify-between w-[1255px] items-center">
          <div className="flex w-[626px] space-x-4 justify-between">
            <span className="text-[46px] ">
              {year}. {month + 1}
            </span>
            <div className="flex items-center ">
              <button
                onClick={handleClickToday}
                className="w-[109px] h-[34px] text-[20px] bor rounded-full"
              >
                TODAY
              </button>
              <div className="flex items-center space-x-[13px]">
                <IconPrev onClick={handlePrevBtn} className="w-5 h-5 cur" />
                <IconNext onClick={handleNextBtn} className="w-5 h-5 cur" />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center">
          <div className="w-[629px] h-[675px] overflow-hidden    border-y-[1.5px] border-y-[#494949]">
            <table className="w-full h-full text-center">
              <thead className="bg_light_pink h-[34px] w-full border-b-[1.5px] border-[#494949]">
                <tr className="text-black text-md font-normal">
                  <th className="text_red font-normal">SUN</th>
                  <th className="font-normal">MON</th>
                  <th className="font-normal">TUE</th>
                  <th className="font-normal">WED</th>
                  <th className="font-normal">THU</th>
                  <th className="font-normal">FRI</th>
                  <th className="font-normal">SAT</th>
                </tr>
              </thead>
              <tbody className="w-full" style={{ borderCollapse: "collapse" }}>
                {calendar.map((week, index) => (
                  <tr key={index} className="">
                    {week.map((dateObj, dayIndex) => {
                      if (!dateObj) {
                        return <td key={dayIndex} className="p-0"></td>;
                      }

                      const { day, currentMonth } = dateObj;
                      const isDayCell = currentMonth;
                      let isHighlighted = false;

                      if (isDayCell) {
                        const date = new Date(year, month, day);
                        const dateString = date.toISOString().split("T")[0];
                        isHighlighted = dateSet.has(dateString);
                      }

                      const isClicked = clickedDay === day && currentMonth;

                      return (
                        <td
                          key={dayIndex}
                          onClick={() => isDayCell && handleClickDate(day)}
                          className="p-0 space-x-0 space-y-0"
                        >
                          <div
                            className={
                              `mx-auto w-[89.86px] h-[129px] transition-all duration-300 ease-in-out bor_light_pink border px-2 py-1 cur`
                              //   ${
                              //   currentMonth
                              //     ? isClicked
                              //       ? "bg_hilight cursor-pointer"
                              //       : isHighlighted
                              //       ? "bg-[#E6E6E650]  cursor-pointer"
                              //       : "bg-transparent text-gray-700 cursor-pointer hover:bg_ligth hover:text-gray-900"
                              //     : "cursor-default"
                              // }
                            }
                          >
                            <div className="flex flex-col items-center justify-center space-y-2 ml-[51px]">
                              <span
                                className={`flex items-center justify-center w-[30px] h-[30px] text-[18px] ${
                                  currentMonth && dayIndex === 0
                                    ? "text_red"
                                    : !currentMonth && dayIndex === 0
                                    ? "text_red opacity-40"
                                    : !currentMonth && dayIndex !== 0
                                    ? "opacity-40"
                                    : ""
                                } ${
                                  isClicked
                                    ? " bg-[#FFBDBD80] rounded-full"
                                    : ""
                                }`}
                              >
                                {day}
                              </span>
                              <div
                                className={`${
                                  isHighlighted ? "bg_deep_pink" : ""
                                } w-1 h-1 rounded-full`}
                              ></div>
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
      <CalendarDateModal />
    </div>
  );
};

export default Calendar;
