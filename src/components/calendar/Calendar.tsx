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

  let day = 1;
  const calendar: (number | null)[][] = [];

  for (let i = 0; i < 6; i++) {
    const week = [];
    for (let j = 0; j < 7; j++) {
      if (i === 0 && j < startingDay) {
        week.push(null);
      } else if (day <= daysInMonth) {
        week.push(day);
        day++;
      } else {
        week.push(null);
      }
    }
    calendar.push(week);
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
    <div className="flex items-center main_container">
      <div
        className={`flex flex-col w-[740px] h-[700px] justify-center items-center content-center relative z-10 bg_depp bg-opacity-70 rounded-2xl mr-24 bor`}
      >
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
        <div>
          <table className="w-[600px] h-[500px] text-center">
            <thead>
              <tr className="text-black text-md font-bold">
                <th className="p-2">일</th>
                <th className="p-2">월</th>
                <th className="p-2">화</th>
                <th className="p-2">수</th>
                <th className="p-2">목</th>
                <th className="p-2">금</th>
                <th className="p-2">토</th>
              </tr>
            </thead>
            <tbody>
              {calendar.map((week, index) => (
                <tr key={index}>
                  {week.map((day, dayIndex) => {
                    const isDayCell = day !== null;
                    let isHighlighted = false;

                    if (isDayCell) {
                      // 날짜 객체 생성 (월은 0부터 시작하므로 -1 해줍니다)
                      const date = new Date(year, month, day);
                      const dateString = date.toISOString().split("T")[0];
                      // 날짜가 dateSet에 있는지 확인
                      isHighlighted = dateSet.has(dateString);
                    }

                    const isClicked = clickedDay === day;

                    return (
                      <td
                        key={dayIndex}
                        onClick={() => isDayCell && handleClickDate(day)}
                        className={`w-[100px] h-[100px] text-center transition-all duration-300 ease-in-out rounded-full cursor-pointer border border-transparent ${
                          isDayCell
                            ? isClicked
                              ? "bg_deeper text-white"
                              : isHighlighted
                              ? "bg-[#d9c6c1] text-white" // 하이라이트 스타일 적용
                              : "bg-transparent text-gray-700 hover:bg_ligth hover:text-gray-900"
                            : ""
                        }`}
                      >
                        {day || ""}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <CalendarDateModal setIsOpen={setIsOpen} />
      </div>

      {/* {modal && <CalendarDateModal onClose={handleCloseModal} />} */}
    </div>
  );
};

export default Calendar;
