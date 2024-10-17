import useSearch from "@/hooks/useSearch";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import commonMutation from "@/queries/commonMutation";
import Toolbar from "@/components/common/toolbar";

const DiaryEditMode = ({ setEditorMode, editorMode }: any) => {
  const id = useSearch.useSearchId();
  const diaryId = useSearch.useSearchDiaryId();

  const { register, handleSubmit } = useForm();

  const {
    data,
    isLoading,
    refetch: diaryRefetch,
  } = useDiaryQueries.useGetDiaryDetail(id, diaryId);

  const defaultContent = Helper.cleanContent(data?.content);

  const editor = useEditor({
    extensions: [StarterKit, Image],
    content: defaultContent,
  });

  const { data: calendarProfile, isLoading: calendarProfileIsLoading } =
    useCalendarQueries.useGetCalendarProfile(id, `userId=${data?.userId}`);

  const { mutate: updateDiary } = useMutation({
    mutationFn: useDiaryMutations.updateDiary,
  });

  const onSubmit = (formData: any) => {
    const submitData = { ...formData, content: editor?.getHTML() };
    updateDiary(
      { calendarId: id, diaryId, body: submitData },
      {
        onSuccess: (result: any) => {
          diaryRefetch();
          setEditorMode(false);
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  };
  return (
    <div className="max-w-[1000px] min-w-[600px] px-20 mt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-2"
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
              onClick={() => setEditorMode(false)}
              type="button"
              className="bg-[#E0CBB7] rounded px-4 py-2 bor"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-[#E0CBB7] rounded px-4 py-2 bor"
            >
              저장
            </button>
          </div>
        </div>
        <div className="flex flex-col">
          <input
            {...register("title")}
            className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded mb-5"
            placeholder="제목을 입력해주세요"
            defaultValue={data?.title}
          />
          <Toolbar editor={editor} />
          <EditorContent className="outline-none" editor={editor} />
        </div>
      </form>
    </div>
  );
};

export default DiaryEditMode;
