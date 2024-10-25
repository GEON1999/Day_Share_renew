const ITEM_TYPE = "CALENDAR";
import { dodum } from "@/app/fonts";
import { useDrag, useDrop } from "react-dnd";
import React, { useEffect, useRef } from "react";

const CalendarItem = ({
  calendar,
  index,
  moveCalendar,
  handleClickCalendar,
  isEditMode,
}: any) => {
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
  );
};

export default CalendarItem;
