import Helper from "@/helper/Helper";
import React from "react";

const TodoItem = React.memo(
  ({
    title,
    isFirst,
    todoCount,
    index,
  }: {
    title: string;
    isFirst: boolean;
    todoCount: number;
    index: number;
  }) => {
    if (
      todoCount === 1 ||
      (todoCount === 2 && index === 0) ||
      (todoCount >= 3 && index === 0)
    ) {
      return (
        <div className="h-[15px] lg:h-[33px] flex">
          <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
          <div className="bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
            {Helper.cutString(title, 5)}
          </div>
        </div>
      );
    }

    if ((todoCount === 2 && index === 1) || (todoCount >= 3 && index === 1)) {
      return (
        <div className="h-[15px] lg:h-[33px] hidden lg:flex">
          <div className="bg-[#F6BEBE] w-[5px] h-full"></div>
          <div className="bg-[#F6BEBE50] w-full h-full pl-[3px] lg:pl-[7px] flex items-center overflow-hidden whitespace-nowrap">
            {todoCount >= 3 ? `+${todoCount - 1}` : Helper.cutString(title, 5)}
          </div>
        </div>
      );
    }

    return null;
  }
);

export default TodoItem;
