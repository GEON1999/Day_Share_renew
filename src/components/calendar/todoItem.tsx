import Helper from "@/helper/Helper";
import React from "react";

const TodoItem = React.memo(
  ({
    title,
    isFirst,
    todoCount,
    index,
    isHoliday = false,
  }: {
    title: string;
    isFirst: boolean;
    todoCount: number;
    index: number;
    isHoliday?: boolean;
  }) => {
    const bgColor = isHoliday ? "bg-[#E55A5A]" : "bg-[#F6BEBE]";
    const bgColorLight = isHoliday ? "bg-[#E55A5A50]" : "bg-[#F6BEBE50]";
    const textColor = isHoliday ? "text-[#E55A5A]" : "";
    const textSize = isHoliday ? "text-[10px]" : "text-[10px] lg:text-[13px]";

    if (
      todoCount === 1 ||
      (todoCount === 2 && index === 0) ||
      (todoCount >= 3 && index === 0)
    ) {
      return (
        <div className="h-[15px] lg:h-[33px] flex">
          <div className={`${bgColor} w-[5px] h-full`}></div>
          <div
            className={`${bgColorLight} w-full h-full pl-[2px] lg:pl-[4px] flex items-center overflow-hidden whitespace-nowrap ${textColor} ${textSize}`}
          >
            {isHoliday
              ? Helper.cutString(title, 8)
              : Helper.cutString(title, 5)}
          </div>
        </div>
      );
    }

    if ((todoCount === 2 && index === 1) || (todoCount >= 3 && index === 1)) {
      return (
        <div className="h-[15px] lg:h-[33px] hidden lg:flex">
          <div className={`${bgColor} w-[5px] h-full`}></div>
          <div
            className={`${bgColorLight} w-full h-full pl-[2px] lg:pl-[4px] flex items-center overflow-hidden whitespace-nowrap ${textColor} ${textSize}`}
          >
            {isHoliday
              ? Helper.cutString(title, 8)
              : todoCount >= 3
              ? `+${todoCount - 1}`
              : Helper.cutString(title, 5)}
          </div>
        </div>
      );
    }

    return null;
  }
);

export default TodoItem;
