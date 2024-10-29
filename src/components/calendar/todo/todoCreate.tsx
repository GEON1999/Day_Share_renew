import useSearch from "@/hooks/useSearch";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import Helper from "@/helper/Helper";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";

const TodoCreate = ({ setEditorMode }: any) => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const { register, handleSubmit } = useForm();

  const { mutate: createTodo } = useMutation({
    mutationFn: useTodoMutations.createTodo,
  });

  const onSubmit = debounce((formData: any) => {
    const { startAt, endAt } = Helper.setAt({ formData });

    const updatedData = {
      ...formData,
      startAt: startAt,
      endAt: endAt,
    };
    createTodo(
      { calendarId: id, query: `date=${date}`, body: updatedData },
      {
        onSuccess: (result: any) => {
          router.push(`/calendar/${id}/todo/${result.id}`);
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  }, StaticKeys.DEBOUNCE_TIME);

  return (
    <div className="main_container">
      <div className="max-w-[1500px] min-w-[600px] px-20 mt-20">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-4"
        >
          <div className="flex justify-between items-center mb-10">
            <h1 className="text-3xl font-bold ">일기 작성</h1>
            <button
              type="submit"
              className="bg_deeper rounded px-4 py-2 bor mb-5"
            >
              저장
            </button>
          </div>
          <div className="flex flex-col space-y-4">
            <input
              {...register("title")}
              className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
              placeholder="제목을 입력해주세요"
            />
            <textarea
              {...register("content")}
              className="border-2 border-gray-400 w-full h-40 px-4 outline-none rounded p-4"
              placeholder="내용을 입력해주세요"
            />
            <div className="flex space-x-3 mt-10">
              {/* 시작일 입력 필드 추가 */}
              <label className="flex flex-col mt-4">
                시작일
                <input
                  type="time"
                  {...register("startAt")}
                  className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
                />
              </label>
              {/* 종료일 입력 필드 추가 */}
              <label className="flex flex-col mt-4">
                종료일
                <input
                  type="time"
                  {...register("endAt")}
                  className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
                />
              </label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TodoCreate;
