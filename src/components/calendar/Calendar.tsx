import { dodum } from "@/app/fonts";
import { useEffect, useState } from "react";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import CalendarDateModal from "./CalendarDateModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";

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
  const [isOpen, setIsOpen] = useState(true);
  const router = useRouter();
  const date = useSearch.useSearchDate();
  const calendarId = useSearch.useSearchId();

  const clickedDate = date ? new Date(parseInt(date)) : null;
  const clickedDay = clickedDate ? clickedDate.getDate() : null;
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const calendar = generateCalendar(year, month);

  const { data: calendarDate, isLoading } =
    useCalendarQueries.useGetCalendarDates(calendarId);

  useEffect(() => {
    document.title = `Calendar - ${year}-${month + 1}`;
  }, [year, month]);

  const handleClickDate = (day: number | null) => {
    if (day === null) return;
    setIsOpen(true);
    const ms = new Date(year, month, day).getTime();
    router.push(`/calendar/${calendarId}/?date=${ms}`);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
  };

  const dateSet = new Set(
    calendarDate?.map((timestamp: any) => {
      const date = new Date(Number(timestamp));
      return date.toISOString().split("T")[0];
    }) || []
  );

  return (
    <div className={`main_container ${dodum.className}`}>
      <div className="flex my-2 mt-20">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          min="1900"
          max="2100"
          className="w-24 h-10 rounded-lg bg_ligth outline-none pl-2 text-gray-700 text-sm md:text-xs border border-[#E0CBB7]"
        />
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value))}
          className="w-24 h-10 rounded-lg bg_ligth outline-none pl-2 text-gray-700 ml-2 text-sm md:text-xs border border-[#E0CBB7]"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i} value={i}>
              {i + 1}월
            </option>
          ))}
        </select>
      </div>
      <div className="flex items-center">
        <div className="w-[610px] h-[715px] rounded-2xl overflow-hidden mr-24 bor shadow_box">
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
                                  ? "bg-[#E6E6E6] opacity-40 cursor-pointer"
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

      {/* {modal && <CalendarDateModal onClose={handleCloseModal} />} */}
    </div>
  );
};

export default Calendar;
