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
    <div className="max-w-[1500px] min-w-[600px] px-20 mt-20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-4"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <img
              className="w-10 h-10 rounded-full bor"
              src={calendarProfile?.img ?? process.env.NEXT_PUBLIC_LOGO}
            />
            <h1 className="font-bold text-xl ml-2">
              {calendarProfile?.name ?? "탈퇴한 유저"}
            </h1>
          </div>
          <div className="flex space-x-2">
            <button
              type="button"
              onClick={() => setEditorMode(false)}
              className="bg_deeper rounded px-4 py-2 bor"
            >
              취소
            </button>
            <button type="submit" className="bg_deeper rounded px-4 py-2 bor">
              저장
            </button>
          </div>
        </div>
        <div className="flex flex-col space-y-4">
          <input
            {...register("title")}
            className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
            placeholder="제목을 입력해주세요"
            defaultValue={data?.title}
          />
          <textarea
            {...register("content")}
            className="border-2 border-gray-400 w-full h-40 px-4 outline-none rounded p-4"
            placeholder="내용을 입력해주세요"
            defaultValue={data?.content}
          />
          <div className="flex space-x-3 mt-10">
            {/* 시작일 입력 필드 추가 */}
            <label className="flex flex-col mt-4">
              시작일
              <input
                type="time"
                {...register("startAt")}
                defaultValue={Helper.formatTimeForInput(data?.startAt)}
                className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
              />
            </label>
            {/* 종료일 입력 필드 추가 */}
            <label className="flex flex-col mt-4">
              종료일
              <input
                type="time"
                {...register("endAt")}
                defaultValue={Helper.formatTimeForInput(data?.endAt)}
                className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
              />
            </label>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoEditMode;
