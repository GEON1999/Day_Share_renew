import { useEffect, useState, useMemo, useCallback } from "react";
import useSearch from "@/hooks/useSearch";
import { useRouter } from "next/navigation";
import CalendarDateModal from "./CalendarDateModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import { useModalStore } from "@/store/modalStore";
import React from "react";
import generateCalendar from "@/components/calendar/generateCalendar";
import CalendarHeader from "@/components/calendar/calendarHeader";
import CalendarNavigation from "@/components/calendar/calendarNavigation";
import CalendarCell from "@/components/calendar/calednarCell";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import { Holiday } from "@/utils/holidayUtils";

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

  const { data: holidays = [] } = useQuery<Holiday[]>({
    queryKey: [QueryKeys.GET_HOLIDAYS, year],
    queryFn: async () => {
      const response = await fetch(`/api/holidays?year=${year}`);
      if (!response.ok) {
        throw new Error("Failed to fetch holidays");
      }
      return response.json();
    },
    staleTime: 1000 * 60 * 60 * 24,
  });

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
                        holidays={holidays}
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
