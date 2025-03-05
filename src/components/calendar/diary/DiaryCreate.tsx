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
    if (formData?.title === "") {
      showAlert("제목을 입력해주세요.", "error");
      return;
    }
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
      <div className="w-[300px] lg:w-[1670px] px-[10px] lg:px-[100px] lg:pb-[80px] flex justify-center items-center lg:items-start">
        <div className="w-[300px] lg:min-w-[600px] lg:mt-[86px] lg:w-[870px] py-[10px] lg:py-[0px]">
          <div
            className="flex items-center space-x-[10px] cur"
            onClick={() => router.push(`/calendar/${id}?date=${date}`)}
          >
            <p className="opacity-50 text_lg">{calendarData?.name}</p>
            <IconNextGray className="w-[5px] h-[10px]" />
          </div>
          <span className="text-[25px] lg:text-[30px] dodum-text">
            일기 등록
          </span>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col noto-sans-text"
          >
            <div className="flex flex-col mt-[10px] lg:mt-[26px]">
              <input
                {...register("title")}
                className="border w-[300px] lg:w-full h-[40px] outline-none rounded-md bg-transparent text_lg placeholder:opacity-50 px-5 mb-5"
                placeholder="제목을 입력해주세요"
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
                  className="w-full h-[300px] lg:h-[595px] outline-none rounded bg-transparent text_lg py-[15px] px-[20px] placeholder:opacity-50 focus:outline-none focus:ring-0"
                />
              </div>
            </div>
            <div className="confirm_btn_container mt-[10px] lg:mt-[25px]">
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
