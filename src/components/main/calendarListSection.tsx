import { useState, useEffect, useCallback, useRef } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import CalendarPagination from "@/components/pagination/calendarPagination";
import CalendarItem from "@/components/main/calendarItem";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useUserMutations from "@/queries/user/useUserMutations";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import useSearch from "@/hooks/useSearch";
import ModalWrapper from "@/components/modal/ModalWrapper";
import AddCalendarModal from "@/components/modal/AddCalendar";
import Helper from "@/helper/Helper";
import { IconAdd, IconSettingOrder } from "@/icons";
import ScrollingComponent from "@/components/common/ScrollingComponent";
import ModalContainer from "../modal/ModalContainer";
import ModalType from "@/keys/ModalType";

const CalendarListSection = () => {
  const router = useRouter();
  const currentPage = useSearch.useSearchPage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: calendarData, isLoading } =
    useCalendarQueries.useGetCalendarList(
      isEditMode ? `isAll=true` : `page=${currentPage}`
    );

  const { mutate: updateUserCalendarOrder } = useMutation({
    mutationFn: useUserMutations.updateUserCalendarOrder,
  });

  const [calendars, setCalendars] = useState<any[]>(
    calendarData?.calendars || []
  );

  useEffect(() => {
    if (calendarData?.calendars) {
      setCalendars(calendarData.calendars);
    }
  }, [calendarData]);

  let combineData = [...calendars];

  for (let i = 4; i > calendars.length; i--) {
    if (!isEditMode) {
      combineData.push({
        isEmpty: true,
      });
    }
  }
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const moveCalendar = useCallback((fromIndex: number, toIndex: number) => {
    const scrollLeft = scrollContainerRef.current?.scrollLeft || 0;

    setCalendars((prevCalendars) => {
      const updatedCalendars = [...prevCalendars];
      const [movedCalendar] = updatedCalendars.splice(fromIndex, 1);
      updatedCalendars.splice(toIndex, 0, movedCalendar);
      return updatedCalendars;
    });

    setTimeout(() => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = scrollLeft;
      }
    }, 0);
  }, []);

  const handleSaveOrder = async () => {
    const orders = calendars.map((calendar) => calendar.id);
    updateUserCalendarOrder(
      { orders },
      {
        onSuccess: () => {
          alert("순서가 저장되었습니다.");
          setIsEditMode(false);
        },
        onError: () => {
          alert("순서 저장에 실패했습니다.");
        },
      }
    );
  };

  const handleCancelOrder = () => setIsEditMode(false);

  const handleClickCalendar = (id: number) =>
    router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);

  const handleAddBtn = () => setIsOpen(true);

  return (
    <section>
      <div className="flex justify-between w-[1260px] items-center mt-[47px]">
        <div className="flex items-center mb-[17px] space-x-2">
          <h2 className={`text-[25px]`}>공유 달력</h2>
          <IconAdd onClick={handleAddBtn} className="w-5 h-5 cur" />
        </div>
        <div className="flex items-center justify-between space-x-4">
          {!calendarData || calendarData?.total_calendars === 0 ? null : (
            <div>
              {isEditMode ? (
                <div className="flex items-center space-x-2 text-[15px] text-[#494949]">
                  <button
                    className="w-10 h-[25px] bor bg_hilight_2 font-bold rounded-md"
                    onClick={handleSaveOrder}
                  >
                    <p className="mb-[1px]">저장</p>
                  </button>
                  <button
                    className="w-10 h-[25px] bor bg-[#49494920] font-bold rounded-md"
                    onClick={handleCancelOrder}
                  >
                    <p className="mb-[1px]">취소</p>
                  </button>
                </div>
              ) : (
                <IconSettingOrder
                  onClick={() => setIsEditMode(true)}
                  className="w-5 h-4 cur"
                />
              )}
            </div>
          )}
          {!isEditMode && (
            <CalendarPagination total_count={calendarData?.total_calendars} />
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="loading spinner small" />
      ) : (
        <DndProvider backend={HTML5Backend}>
          <ScrollingComponent
            ref={scrollContainerRef}
            className="overflow-auto max-w-[1260px] flex space-x-4"
          >
            {(isEditMode ? calendars : combineData.slice(0, 5)).map(
              (calendar, index) => (
                <CalendarItem
                  key={calendar.id ?? index}
                  calendar={calendar}
                  index={index}
                  moveCalendar={moveCalendar}
                  handleClickCalendar={handleClickCalendar}
                  isEditMode={isEditMode}
                />
              )
            )}
          </ScrollingComponent>
        </DndProvider>
      )}
      {isOpen && (
        <ModalContainer
          setIsOpen={setIsOpen}
          initialModal={ModalType.ADD_CALENDAR}
        />
      )}
    </section>
  );
};

export default CalendarListSection;
