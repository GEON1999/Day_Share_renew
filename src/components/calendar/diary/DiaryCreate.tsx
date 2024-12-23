import useSearch from "@/hooks/useSearch";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/components/common/toolbar";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";
import Placeholder from "@tiptap/extension-placeholder";

const DiaryCreate = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const { register, handleSubmit } = useForm();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Placeholder.configure({
        placeholder: "내용을 입력해주세요",
      }),
    ],
  });

  const { mutate: createDiary } = useMutation({
    mutationFn: useDiaryMutations.createDiary,
  });

  const onSubmit = debounce((formData: any) => {
    const thumnail = editor?.getHTML().split("<img")[1]?.split('"')[1];
    const submitData = {
      ...formData,
      content: editor?.getHTML(),
      img: thumnail ?? null,
    };
    createDiary(
      { calendarId: id, query: `date=${date}`, body: submitData },
      {
        onSuccess: (result: any) => {
          router.push(`/calendar/${id}/diary/${result.id}`);
          console.log("success", result);
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  }, StaticKeys.DEBOUNCE_TIME);

  return (
    <div className="main_container center">
      <div className="w-[1670px] px-[100px] pb-[80px] flex justify-center">
        <div className="min-w-[600px] mt-[86px] w-[1270px]">
          <div className="flex items-center space-x-[10px] ">
            <span className="text_red text-[20px]">일기 등록</span>
            <span className="text-[#999790] text-[16px]">|</span>
            <span
              onClick={() => router.push(`/calendar/${id}?date=${date}`)}
              className="text-[#999790] text-[16px] cur mt-[1px]"
            >
              이전으로 돌아가기
            </span>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
            <div className="flex flex-col mt-[26px]">
              <input
                {...register("title")}
                className="border w-full h-[40px] outline-none rounded-md bg-transparent text-[20px] placeholder:text-[#495163] px-5 mb-5"
                placeholder="제목을 입력해주세요"
              />
              <div
                className="border rounded-md flex flex-col h-[595px] overflow-y-auto"
                onClick={() => editor?.commands.focus()}
              >
                <Toolbar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="w-full flex-1 outline-none rounded bg-transparent text-[20px] py-[15px] px-[20px] placeholder:text-[#495163] focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="flex ml-auto items-center space-x-[10px] mt-[25px]">
              <button
                onClick={() => router.push(`/calendar/${id}?date=${date}`)}
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
          </form>
        </div>
      </div>
    </div>
  );
};

export default DiaryCreate;
