import React from "react";

const TodoSectionFallback = () => {
  return (
    <section className="mt-[15px] lg:mt-[38px] side_todo_container">
      <div className="flex items-center space-x-[6px] content-center mb-[10px]">
        <div className="h-[24px] w-[80px] bg-gray-200 animate-pulse rounded"></div>
        <div className="w-4 h-4 bg-gray-200 animate-pulse rounded-full"></div>
      </div>

      <div className="mb-2">
        <div className="inline-block bg-gray-200 animate-pulse h-[20px] w-[100px] rounded mb-1"></div>

        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-1 rounded-md mb-2"
          >
            <div className="flex items-center">
              <div className="w-[14px] h-[14px] bg-gray-200 animate-pulse rounded-full"></div>
              <div className="ml-2 h-[16px] w-[120px] bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-[14px] h-[14px] bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        ))}
      </div>

      <div>
        <div className="inline-block bg-gray-200 animate-pulse h-[20px] w-[100px] rounded mb-1"></div>

        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-1 rounded-md mb-2"
          >
            <div className="flex items-center">
              <div className="w-[14px] h-[14px] bg-gray-200 animate-pulse rounded-full"></div>
              <div className="ml-2 h-[16px] w-[100px] bg-gray-200 animate-pulse rounded"></div>
            </div>
            <div className="w-[14px] h-[14px] bg-gray-200 animate-pulse rounded-full"></div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4 space-x-2">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="w-[30px] h-[30px] bg-gray-200 animate-pulse rounded"
          ></div>
        ))}
      </div>
    </section>
  );
};

export default TodoSectionFallback;
