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
  console.log("calendarDate", calendarDate);

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

  const handleClickCreateDiary = () =>
    router.push(`/calendar/${calendarId}/diary/create?date=${date}`);

  const handleClickCreateTodo = () =>
    router.push(`/calendar/${calendarId}/todo/create?date=${date}`);

  return (
    <div className={`main_container ${dodum.className}`}>
      <div className="flex items-center space-x-10 mt-[30px]">
        <div className="w-[150px] h-[100px] bor shadow_box rounded-md">
          <img
            className="object-cover w-full h-full rounded-md"
            src={calendarDate?.calendar?.img ?? process.env.NEXT_PUBLIC_LOGO}
          />
        </div>
        <h1 className="text-[40px]">{calendarDate?.calendar?.name ?? ""}</h1>
      </div>
      <div className="flex justify-between w-[1255px] items-center">
        <div className="flex my-2 mt-14 space-x-4">
          <span className="text-2xl font-bold">
            {year}년 {month + 1}월
          </span>
          <div className="flex items-center space-x-[13px] cur">
            <IconPrev onClick={handlePrevBtn} className="w-5 h-5"/>
            <IconNext onClick={handleNextBtn} className="w-5 h-5"/>
          </div>
          <button onClick={handleClickToday} className="p-1 bor rounded">
            오늘
          </button>
        </div>
        <div className="flex space-x-2 justify-center mt-5">
          <button
            onClick={handleClickCreateTodo}
            className="bg_hilight w-[150px] h-[40px] rounded  bor"
          >
            일정 생성
          </button>
          <button
            onClick={handleClickCreateDiary}
            className="bg_hilight w-[150px] h-[40px] rounded bor"
          >
            일기 생성
          </button>
        </div>
      </div>
      <div className="flex items-center">
        <div className="w-[610px] h-[715px] rounded-md overflow-hidden mr-[38px] bor shadow_box">
          <table className="w-full h-full text-center">
            <thead className="bg_hilight h-[80px] w-full">
              <tr className="text-black text-md font-bold">
                <th className="text_red">일</th>
                <th>월</th>
                <th>화</th>
                <th>수</th>
                <th>목</th>
                <th>금</th>
                <th>토</th>
              </tr>
            </thead>
            <tbody className="w-full">
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
                        className="p-0"
                      >
                        <div
                          className={`mx-auto w-[70px] h-[70px] rounded-full flex items-center justify-center transition-all duration-300 ease-in-out ${
                            currentMonth
                              ? isClicked
                                ? "bg_hilight cursor-pointer"
                                : isHighlighted
                                  ? "bg-[#E6E6E650]  cursor-pointer"
                                  : "bg-transparent text-gray-700 cursor-pointer hover:bg_ligth hover:text-gray-900"
                              : "cursor-default"
                          }`}
                        >
                          <span
                            className={
                              currentMonth && dayIndex === 0
                                ? "text_red"
                                : !currentMonth && dayIndex === 0
                                  ? "text_red opacity-40"
                                  : !currentMonth && dayIndex !== 0
                                    ? "opacity-40"
                                    : ""
                            }
                          >
                            {day}
                          </span>
                        </div>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <CalendarDateModal />
        </div>
      </div>
    </div>
  );
};

export default Calendar;
