import CalendarTodoPagination from "@/components/pagination/calendarTodoPagination";
import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import {
  IconAdd,
  IconCheck_o,
  IconCheck_x,
  IconClose,
  IconEmptyTodo,
  IconNext,
  IconX,
} from "@/icons";
import StaticKeys from "@/keys/StaticKeys";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import { TimePicker } from "antd";
import { debounce } from "lodash";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

const TodoList = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const calendarId = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const calendarTodoPage = useSearch.useSearchCalendarTodoPage();
  const [isOpen, setIsOpen] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs>(
    dayjs(Number(date)).hour(10).minute(0)
  );
  const [endTime, setEndTime] = useState<Dayjs>(
    dayjs(Number(date)).hour(11).minute(0)
  );

  const { register, handleSubmit, reset } = useForm();

  const {
    data: todoData,
    isLoading,
    refetch,
  } = useTodoQueries.useGetTodos(
    calendarId,
    `date=${date}&calendar_todo_page=${calendarTodoPage}`
  );

  const { mutate: checkTodo } = useMutation({
    mutationFn: useTodoMutations.toggleTodoComplete,
  });

  const { mutate: createTodo } = useMutation({
    mutationFn: useTodoMutations.createTodo,
  });

  const handleClickTodo = (id: number) => {
    router.push(`/calendar/${calendarId}/todo/${id}?date=${date}`);
  };

  const handleTodoClick = (calId: number, todoId: number, e: any) => {
    e.stopPropagation();
    checkTodo(
      { calendarId: calId, todoId },
      {
        onSuccess: () => {
          console.log("성공");
          refetch();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleStartTimeChange = (value: any) => {
    setStartTime(value);
  };

  const handleEndTimeChange = (value: any) => {
    setEndTime(value);
  };

  const onSubmit = debounce((formData: any) => {
    const startAtUTC = dayjs(startTime).format();
    const endAtUTC = dayjs(endTime).format();

    const updatedData = {
      ...formData,
      startAt: startAtUTC,
      endAt: endAtUTC,
    };
    createTodo(
      { calendarId: id, query: `date=${date}`, body: updatedData },
      {
        onSuccess: async (result: any) => {
          await refetch();
          reset();
          setIsOpen(false);
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  }, StaticKeys.DEBOUNCE_TIME);

  const handleAddBtn = () => setIsOpen(true);
  const handleClose = () => setIsOpen(false);

  return (
    <div className="relative">
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-2xl">공유 일정</h1>
          <IconAdd onClick={handleAddBtn} className="w-5 h-5 cur" />
        </div>
        <div>
          <CalendarTodoPagination total_count={todoData?.total_count} />
        </div>
      </div>
      <div className="flex-grow overflow-hidden px-[25px] bor w-[480px] h-[140px] mt-[10px] rounded-md bg_deep_2 py-[10px] shadow_box">
        {todoData?.todos?.length === 0 || !todoData ? (
          <div className="flex justify-between items-center h-full px-[13px]">
            <p className="text-[#2D2D2E] text-[20px]">
              일정이 없어요. 추가해 볼까요?
            </p>
            <IconEmptyTodo className="w-[134px] h-[162.36px] mt-12" />
          </div>
        ) : (
          todoData?.todos?.map((todo: any, index: number) => {
            console.log(todo);
            return (
              <div
                onClick={() => handleClickTodo(todo.id)}
                key={todo.id}
                className={`h-[40px] cur flex justify-between items-center py-[10px] text-[20px] ${
                  index != 2 ? "border-b border-[#49494950]" : ""
                }`}
              >
                <div className={`flex items-center space-x-[15px]`}>
                  <div>{Helper.formatTimeForTodo(todo.startAt)}</div>
                  <div>{todo.title}</div>
                </div>
                <div className="flex items-center space-x-[15px]">
                  <div>{todo.userProfile.name}</div>
                  <div
                    className="w-5 h-5 cur"
                    onClick={(e) =>
                      handleTodoClick(todo.calendarId, todo.id, e)
                    }
                  >
                    {todo.isCompleted ? <IconCheck_o /> : <IconCheck_x />}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
      {isOpen && (
        <div className="absolute w-[484px] h-[737px] bg_depp bor rounded-md shadow_box top-0 z-50 p-[20px] text-[#494949] noto-sans-text">
          <IconX
            className="w-[10px] h-[10px] ml-auto cur"
            onClick={handleClose}
          />
          <h1 className="-mt-[10px] text-[25px]">일정 등록</h1>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col mt-[22px] justify-between h-[90%]"
          >
            <div>
              <div className="flex items-center space-x-[12px]">
                <label htmlFor="title" className="text-[20px]">
                  제목
                </label>
                <input
                  {...register("title", { required: true })}
                  type="text"
                  className="w-[352px] h-[30px] text-[15px] bor rounded-md px-[10px] py-[6px] outline-none placeholder:text-[#C2BFBC]"
                  placeholder="제목을 입력해 보세요."
                />
              </div>
              <div className="flex items-center my-[13px]">
                <label htmlFor="date" className="text-[20px]">
                  일시
                </label>
                <input
                  className="ml-[12px] w-[102px] h-[30px] text-[15px] bor rounded-md px-[8px] py-[6px] outline-none placeholder:text-[#C2BFBC] mr-[8px] disabled cursor-not-allowed text-center"
                  disabled
                  value={Helper.formatDateForTodo(date)}
                />
                <TimePicker
                  value={startTime}
                  format="A hh:mm"
                  onChange={handleStartTimeChange}
                  minuteStep={5}
                  popupClassName="custom-timepicker-dropdown"
                  placement="bottomLeft"
                  suffixIcon={
                    <IconNext className="w-[7px] h-[12px] rotate-90" />
                  }
                  allowClear={false}
                  placeholder="시작 시간"
                />
                <p className="ml-[4px] text-[20px] font-medium font-satoshi">
                  -
                </p>
                <TimePicker
                  value={endTime}
                  format="A hh:mm"
                  onChange={handleEndTimeChange}
                  minuteStep={5}
                  popupClassName="custom-timepicker-dropdown"
                  placement="bottomLeft"
                  suffixIcon={
                    <IconNext className="w-[7px] h-[12px] rotate-90" />
                  }
                  allowClear={false}
                  placeholder="종료 시간"
                />
              </div>
              <div className="flex items-start space-x-[12px]">
                <label htmlFor="content" className="text-[20px]">
                  설명
                </label>
                <textarea
                  {...register("content", { required: true })}
                  className="w-[352px] h-[133px] text-[15px] bor rounded-md px-[10px] py-[6px] outline-none placeholder:text-[#C2BFBC]"
                  placeholder="일정에 필요한 설명을 남겨보세요."
                />
              </div>
            </div>
            <div className="flex mt-[40px] text-[20px] noto-sans-text space-x-[10px] mx-auto">
              <button
                onClick={handleClose}
                type="button"
                className="rounded-md bg-white w-[60px] h-[35px] bor hover:bg-[#49494910]"
              >
                취소
              </button>
              <button
                type="submit"
                className="rounded-md bg-[#F6BEBE] w-[60px] h-[35px] bor hover:bg-[#F69D9D]"
              >
                저장
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TodoList;
