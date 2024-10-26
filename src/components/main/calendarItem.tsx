const ITEM_TYPE = "CALENDAR";
import { dodum } from "@/app/fonts";
import { useDrag, useDrop } from "react-dnd";
import React, { useEffect, useRef, useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import AddCalendarModal from "@/components/modal/AddCalendar";

const CalendarItem = ({
  calendar,
  index,
  moveCalendar,
  handleClickCalendar,
  isEditMode,
}: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: isEditMode, // 수정 모드일 때만 드래그 가능
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: () => isEditMode, // 수정: 함수로 변경하여 오류 해결
    hover: (draggedItem: any) => {
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

  return (
    <>
      {calendar.isEmpty ? (
        <div className="cur flex flex-col" onClick={() => setIsOpen(true)}>
          <div className="shadow_box rounded-md">
            <div
              className={`object-cover rounded-md bor bg-[#C5C5C5] flex justify-center items-center ${
                isEditMode ? "hidden" : "cursor-pointer w-[300px] h-[200px]"
              }`}
            >
              <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241026130254_02c164ef3ab7406da90da5bbd373da9a.png" />
            </div>
          </div>
        </div>
      ) : (
        <div
          ref={ref}
          className="cur flex flex-col items-center justify-center"
          style={{ opacity: isEditMode && isDragging ? 0.5 : 1 }}
          onClick={() => !isEditMode && handleClickCalendar(calendar.id)}
        >
          <div className="shadow_box rounded-md">
            <img
              className={`object-cover rounded-md bor ${
                isEditMode
                  ? "cursor-move w-20 h-20"
                  : "cursor-pointer w-[300px] h-[200px]"
              }`}
              src={calendar.img}
            />
          </div>
          <div className="flex items-center space-x-1 mt-2">
            <h3 className={`${dodum.className}`}>{calendar.name}</h3>
            {calendar.isRead ? null : (
              <div className="w-6 h-6 bg-[#EF6565] rounded-full text-white text-3xl flex items-center justify-center overflow-hidden">
                <span className="transform scale-75 leading-none">N</span>
              </div>
            )}
          </div>
        </div>
      )}
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <AddCalendarModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </>
  );
};

export default CalendarItem;
