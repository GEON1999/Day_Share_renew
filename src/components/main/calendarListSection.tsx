import { useState, useEffect } from "react";
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

const CalendarListSection = () => {
  const router = useRouter();

  const currentPage = useSearch.useSearchPage();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const { data: calendarData } = useCalendarQueries.useGetCalendarList(
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

  const moveCalendar = (fromIndex: number, toIndex: number) => {
    const updatedCalendars = [...calendars];
    const [movedCalendar] = updatedCalendars.splice(fromIndex, 1);
    updatedCalendars.splice(toIndex, 0, movedCalendar);
    setCalendars(updatedCalendars);
  };

  const handleSaveOrder = async () => {
    if (isEditMode) {
      const orders = calendars.map((calendar) => calendar.id);
      updateUserCalendarOrder(
        { orders }, // 서버에서 orders를 리스트로 받도록 수정
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
    } else {
      setIsEditMode(true);
    }
  };

  const handleClickCalendar = (id: number) => {
    router.push(`/calendar/${id}`);
  };

  const handleAddBtn = () => setIsOpen(true);
  return (
    <section>
      <div className="flex justify-between w-[1260px] items-center mt-[47px]">
        <div className="flex items-center mb-[17px] space-x-1">
          <h2 className="text-[30px]">공유 달력</h2>
          <img
            onClick={handleAddBtn}
            className="cur"
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183542_8e6784334f79491988810457d2b5eb6a.png"
          />
        </div>
        <div className="flex items-center justify-between space-x-4">
          <button
            onClick={handleSaveOrder}
            className="p-2 bg_hilight bor rounded"
          >
            {isEditMode ? "수정 완료" : "순서 변경"}
          </button>
          {!isEditMode && (
            <CalendarPagination total_count={calendarData?.total_calendars} />
          )}
        </div>
      </div>

      <DndProvider backend={HTML5Backend}>
        <div className="flex space-x-4">
          {(isEditMode ? calendars : calendars.slice(0, 5)).map(
            (calendar, index) => (
              <CalendarItem
                key={calendar.id}
                calendar={calendar}
                index={index}
                moveCalendar={moveCalendar}
                handleClickCalendar={handleClickCalendar}
                isEditMode={isEditMode}
              />
            )
          )}
        </div>
      </DndProvider>
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <AddCalendarModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </section>
  );
};

export default CalendarListSection;
