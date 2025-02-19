import useSearch from "@/hooks/useSearch";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/components/common/toolbar";
import { useAlert } from "@/components/alert/AlertContext";

const DiaryEditMode = ({ setEditorMode }: any) => {
  const [isSubmit, setIsSubmit] = useState(false);
  const id = useSearch.useSearchId();
  const diaryId = useSearch.useSearchDiaryId();
  const { showAlert } = useAlert();
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
    if (isSubmit) return;
    setIsSubmit(true);
    const thumnail = editor?.getHTML().split("<img")[1]?.split('"')[1];
    const submitContent = editor?.getHTML().replace(/<p><\/p>/g, "<p><br></p>");
    const submitData = {
      ...formData,
      content: submitContent,
      img: thumnail ?? null,
    };
    updateDiary(
      { calendarId: id, diaryId, body: submitData },
      {
        onSuccess: (result: any) => {
          showAlert("일기가 수정되었습니다.", "success");
          diaryRefetch();
          setEditorMode(false);
          setIsSubmit(false);
        },
        onError: () => {
          showAlert("일기 수정에 실패했습니다.", "error");
          setIsSubmit(false);
        },
      }
    );
  };
  return (
    <div className="w-[300px] lg:min-w-[600px] lg:mt-[86px] lg:w-[870px] py-[10px] lg:py-[0px]">
      <div className="flex items-center space-x-[10px]">
        <span className="text-[25px] lg:text-[30px] dodum-text">일기 수정</span>
        <span className="text-[#999790] text-[16px]">|</span>
        <span
          onClick={() => setEditorMode(false)}
          className="text-[#999790] text-base cur mt-[1px]"
        >
          이전으로 돌아가기
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col mt-[10px] lg:mt-[26px]">
          <input
            {...register("title")}
            className="border w-[300px] lg:w-full h-[40px] outline-none rounded-md bg-transparent text-lg placeholder:opacity-50 px-5 mb-5 noto-sans-text"
            placeholder="제목을 입력해주세요"
            defaultValue={data?.title}
          />
          <div className="relative">
            <Toolbar editor={editor} />
          </div>
          <div
            onClick={() => editor?.commands.focus()}
            className="border border-t-0 rounded-md rounded-t-none flex flex-col h-[400px] lg:h-[560px] overflow-y-scroll relative mt-[35px]"
          >
            <EditorContent
              editor={editor}
              className="w-full h-[300px] lg:h-[595px] outline-none rounded bg-transparent text-lg py-[15px] px-[20px] placeholder:opacity-50 focus:outline-none focus:ring-0"
            />
          </div>
        </div>
        <div className="confirm_btn_container mt-[10px] lg:mt-[25px]">
          <button
            onClick={() => setEditorMode(false)}
            type="button"
            className="cancel"
          >
            취소
          </button>
          <button type="submit" className="confirm">
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default DiaryEditMode;
