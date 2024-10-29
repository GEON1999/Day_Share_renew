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

const DiaryCreate = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const { register, handleSubmit } = useForm();

  const editor = useEditor({
    extensions: [StarterKit, Image],
  });

  const { mutate: createDiary } = useMutation({
    mutationFn: useDiaryMutations.createDiary,
  });

  const onSubmit = debounce((formData: any) => {
    const submitData = { ...formData, content: editor?.getHTML() };
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
    <div className="main_container">
      <div className="max-w-[1500px] min-w-[600px] px-20 mt-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col space-y-2"
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
          <div className="flex flex-col">
            <input
              {...register("title")}
              className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded mb-5"
              placeholder="제목을 입력해주세요"
            />
            <Toolbar editor={editor} />
            <EditorContent className="outline-none" editor={editor} />
          </div>
        </form>
      </div>
    </div>
  );
};

export default DiaryCreate;
