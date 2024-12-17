import useSearch from "@/hooks/useSearch";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import Helper from "@/helper/Helper";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";

const TodoEditMode = ({ setEditorMode }: any) => {
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchTodoId();

  const { register, handleSubmit } = useForm();

  const {
    data,
    isLoading,
    refetch: todoReFetch,
  } = useTodoQueries.useGetTodoDetail(id, todoId);
  const { data: calendarProfile, isLoading: calendarProfileIsLoading } =
    useCalendarQueries.useGetCalendarProfile(id, `userId=${data?.userId}`);

  const { mutate: updateTodo } = useMutation({
    mutationFn: useTodoMutations.updateTodo,
  });

  const onSubmit = (formData: any) => {
    const { startAt, endAt } = Helper.setAt({ data, formData });

    const updatedData = {
      ...formData,
      startAt: startAt,
      endAt: endAt,
    };
    updateTodo(
      { calendarId: id, todoId, body: updatedData },
      {
        onSuccess: (result: any) => {
          todoReFetch();
          setEditorMode(false);
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  };
  return (
    <div className="min-w-[600px] mt-[86px] w-[1270px]">
      <div className="flex items-center space-x-[10px] ">
        <span className="text_red text-[20px]">일정 수정</span>
        <span className="text-[#999790] text-[16px]">|</span>
        <span
          onClick={() => setEditorMode(false)}
          className="text-[#999790] text-[16px] cur mt-[1px]"
        >
          이전으로 돌아가기
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col mt-[30px]">
          <input
            {...register("title")}
            className="border w-full h-[40px] outline-none rounded-md bg-transparent text-[20px] placeholder:text-[#495163] px-5"
            placeholder="제목을 입력해주세요"
            defaultValue={data?.title}
          />
          <textarea
            {...register("content")}
            className="border-2 border-gray-400 w-full h-[135px] outline-none rounded mt-[30px] p-5 bg-transparent placeholder:text-[#495163] text-[20px]"
            placeholder="일정에 필요한 설명을 남기세요."
            defaultValue={data?.content}
          />
          <div className="flex items-center justify-between">
            <div className="flex space-x-3 mt-[30px]">
              {/* 시작일 입력 필드 추가 */}
              <label className="flex flex-col ">
                시작 시간
                <input
                  type="time"
                  {...register("startAt")}
                  defaultValue={Helper.formatTimeForInput(data?.startAt)}
                  className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
                />
              </label>
              {/* 종료일 입력 필드 추가 */}
              <label className="flex flex-col">
                종료 시간
                <input
                  type="time"
                  {...register("endAt")}
                  defaultValue={Helper.formatTimeForInput(data?.endAt)}
                  className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
                />
              </label>
            </div>
            <div className="flex items-center space-x-[10px] mt-[25px]">
              <button
                onClick={() => setEditorMode(false)}
                type="button"
                className="rounded-md w-[60px] h-[35px] bor text-[20px]"
              >
                취소
              </button>
              <button
                type="submit"
                className="bg_hilight rounded-md w-[60px] h-[35px] bor text-[20px]"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoEditMode;
