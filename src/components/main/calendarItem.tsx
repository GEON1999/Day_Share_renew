import { useDrag, useDrop } from "react-dnd";
import React, { useEffect, useRef, useState, memo } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import AddCalendarModal from "@/components/modal/AddCalendar";
import StaticKeys from "@/keys/StaticKeys";

const CalendarItem = memo(
  ({ calendar, index, moveCalendar, handleClickCalendar, isEditMode }: any) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
      type: StaticKeys.CALENDAR_TYPE,
      item: { index, calendar },
      canDrag: isEditMode,
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    const [, drop] = useDrop({
      accept: StaticKeys.CALENDAR_TYPE,
      canDrop: () => isEditMode,
      hover: (draggedItem: any, monitor) => {
        if (!ref.current) return;

        const draggedIndex = draggedItem.index;
        const hoverIndex = index;

        if (draggedIndex === hoverIndex) return;

        moveCalendar(draggedIndex, hoverIndex);
        draggedItem.index = hoverIndex;
      },
    });

    useEffect(() => {
      if (isEditMode) {
        drag(drop(ref));
      }
    }, [isEditMode, drag, drop]);

    useEffect(() => {
      if (isEditMode) {
        drag(drop(ref));
      }
    }, [isEditMode, drag, drop]);

    return (
      <>
        {calendar.isEmpty ? (
          <div className="cur" onClick={() => setIsOpen(true)}>
            <div
              className={`object-cover bor bg-[#C5C5C5] flex justify-center items-center shadow_box rounded-md mb-2 ${
                isEditMode
                  ? "hidden"
                  : "cur w-[140px] h-[93.06px] lg:w-[300px] lg:h-[200px]"
              }`}
            >
              <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241026130254_02c164ef3ab7406da90da5bbd373da9a.png" />
            </div>
          </div>
        ) : (
          <div
            ref={ref}
            className="cur flex flex-col items-center justify-center flex-shrink-0"
            style={{ opacity: isEditMode && isDragging ? 0.5 : 1 }}
            onClick={() => !isEditMode && handleClickCalendar(calendar.id)}
          >
            <div className="shadow_box rounded-md ">
              <img
                className={`object-cover rounded-md bor ${
                  isEditMode
                    ? "cursor-move w-[100px] h-[66.66px] lg:w-[170px] lg:h-[113px]"
                    : "cursor-pointer w-[140px] h-[93.06px] lg:w-[300px] lg:h-[200px]"
                }`}
                src={
                  calendar.img == ""
                    ? process.env.NEXT_PUBLIC_CALENDAR_IMG
                    : calendar.img
                }
                alt={calendar.img}
              />
            </div>
            <div className="flex items-center space-x-1 mt-2  lg:mb-[23px]">
              <p
                className={`${
                  isEditMode
                    ? "text-[15px] lg:text-[20px]"
                    : "text-[15px] lg:text-[23px]"
                }`}
              >
                {calendar.name}
              </p>
              {calendar.isRead ? null : (
                <img
                  className="h-[15px] w-[15px] lg:h-[23.6px] lg:w-[23.6px]"
                  src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241029163920_430d6b2ba39e4a05819e9c943b8b3461.png"
                  alt="new"
                />
              )}
            </div>
          </div>
        )}
        <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
          <AddCalendarModal setIsOpen={setIsOpen} />
        </ModalWrapper>
      </>
    );
  }
);

export default CalendarItem;
