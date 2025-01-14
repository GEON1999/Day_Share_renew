import useSearch from "@/hooks/useSearch";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import { EditorContent, useEditor } from "@tiptap/react";
import Image from "@tiptap/extension-image";
import StarterKit from "@tiptap/starter-kit";
import Toolbar from "@/components/common/toolbar";
import { useRouter } from "next/navigation";
import Placeholder from "@tiptap/extension-placeholder";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { IconNextGray } from "@/icons";
import { useAlert } from "@/components/alert/AlertContext";

const DiaryCreate = () => {
  const [isSubmit, setIsSubmit] = useState(false);
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const { data: calendarData, isLoading: calendarIsLoading } =
    useCalendarQueries.useGetCalendarBasic(id);

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

  const { showAlert } = useAlert();

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
    createDiary(
      { calendarId: id, query: `date=${date}`, body: submitData },
      {
        onSuccess: (result: any) => {
          showAlert("일기가 등록되었습니다.", "success");
          router.push(`/calendar/${id}/diary/${result.id}?date=${date}`);
          setIsSubmit(false);
        },
        onError: () => {
          showAlert("일기 등록에 실패했습니다.", "error");
          setIsSubmit(false);
        },
      }
    );
  };

  return (
    <div className="main_container center">
      <div className="w-[1670px] px-[100px] pb-[80px] flex justify-center">
        <div className="min-w-[600px] mt-[86px] w-[870px]">
          <div
            className="flex items-center space-x-[10px] cur"
            onClick={() => router.push(`/calendar/${id}?date=${date}`)}
          >
            <p className="opacity-50 text-[20px]">{calendarData?.name}</p>
            <IconNextGray className="w-[5px] h-[10px]" />
          </div>
          <span className="text-[30px] dodum-text">일기 등록</span>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col noto-sans-text"
          >
            <div className="flex flex-col mt-[26px]">
              <input
                {...register("title")}
                className="border w-full h-[40px] outline-none rounded-md bg-transparent text-[20px] placeholder:opacity-50 px-5 mb-5"
                placeholder="제목을 입력해주세요"
              />
              <div
                className="border rounded-md flex flex-col h-[595px] overflow-y-auto"
                onClick={() => editor?.commands.focus()}
              >
                <Toolbar editor={editor} />
                <EditorContent
                  editor={editor}
                  className="w-full h-[595px] outline-none rounded bg-transparent text-[20px] py-[15px] px-[20px] placeholder:opacity-50 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="confirm_btn_container mt-[25px]">
              <button
                onClick={() => router.push(`/calendar/${id}?date=${date}`)}
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
      </div>
    </div>
  );
};

export default DiaryCreate;
