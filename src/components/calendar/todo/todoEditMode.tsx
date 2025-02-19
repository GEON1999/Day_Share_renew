import useSearch from "@/hooks/useSearch";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Helper from "@/helper/Helper";
import { IconNext, IconX } from "@/icons";
import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { useAlert } from "@/components/alert/AlertContext";
import { useModalStore } from "@/store/modalStore";

const TodoEditMode = ({ setEditorMode }: any) => {
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchQueryTodoId();
  const { setCalendarDateModalOpen } = useModalStore();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const {
    data,
    isLoading,
    refetch: todoReFetch,
  } = useTodoQueries.useGetTodoDetail(id, todoId ?? "");
  const [isSubmit, setIsSubmit] = useState(false);
  const [startTime, setStartTime] = useState<Dayjs>(dayjs(data?.startAt));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs(data?.endAt));
  const { showAlert } = useAlert();

  const handleStartTimeChange = (value: any) => {
    setStartTime(value);
  };

  const handleEndTimeChange = (value: any) => {
    setEndTime(value);
  };

  const { mutate: updateTodo } = useMutation({
    mutationFn: useTodoMutations.updateTodo,
  });
  const onSubmit = (formData: any) => {
    if (isSubmit) return;
    setIsSubmit(true);
    const startAtUTC = dayjs(startTime).format();
    const endAtUTC = dayjs(endTime).format();

    const updatedData = {
      ...formData,
      startAt: startAtUTC,
      endAt: endAtUTC,
    };
    updateTodo(
      { calendarId: id, todoId, body: updatedData },
      {
        onSuccess: (result: any) => {
          showAlert("일정이 수정되었습니다.", "success");
          todoReFetch();
          setEditorMode(false);
          setCalendarDateModalOpen(true);
          setIsSubmit(false);
        },
        onError: () => {
          showAlert("일정 수정에 실패했습니다.", "error");
          setIsSubmit(false);
        },
      }
    );
  };

  const handleCancel = () => {
    setEditorMode(false);
  };

  return (
    <div className="lg:absolute w-[300px] lg:w-[490px] h-[600px] lg:h-[737px] bg_depp bor rounded-md shadow_box top-0 z-50 p-[20px]  noto-sans-text">
      <div
        className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
        onClick={handleCancel}
      >
        <IconX className="w-full h-full" />
      </div>
      <h1 className="-mt-[10px] text-xl">일정 등록</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-[22px] justify-between h-[90%]"
      >
        <div>
          <div className="flex items-center space-x-[12px]">
            <label htmlFor="title" className="text-lg">
              제목
            </label>
            <input
              {...register("title", {
                required: "제목을 입력해주세요.",
                maxLength: {
                  value: 10,
                  message: "제목은 10자 이하로 입력해주세요.",
                },
              })}
              defaultValue={data?.title}
              type="text"
              className="w-[220px] lg:w-[381px] h-[30px] text-base bor rounded-md px-[10px] py-[6px] outline-none placeholder:text-[#C2BFBC]"
              placeholder="제목을 입력해 보세요."
            />
          </div>
          <p className="text-base text-red mt-[10px]">
            {errors.title?.message?.toString()}
          </p>
          <div className="flex flex-col lg:flex-row items-center my-[13px]">
            <div>
              <label htmlFor="date" className="text-lg">
                일시
              </label>
              <input
                className="ml-[11px] lg:ml-[12px] w-[220px] lg:w-[124px] h-[30px] text-base bor rounded-md px-[8px] py-[6px] outline-none placeholder:text-[#C2BFBC] lg:mr-[8px] disabled cursor-not-allowed text-center"
                disabled
                value={Helper.formatDateForTodoDetail(data?.date, true)}
              />
            </div>
            <div className="flex ml-[35px] lg:ml-0 mt-[10px] lg:mt-0">
              <TimePicker
                value={startTime}
                format="A hh:mm"
                onChange={handleStartTimeChange}
                minuteStep={5}
                popupClassName="custom-timepicker-dropdown"
                placement="bottomLeft"
                suffixIcon={<IconNext className="w-[7px] h-[12px] rotate-90" />}
                allowClear={false}
                placeholder="시작 시간"
              />
              <p className="mx-[6px] text-lg font-medium font-satoshi">-</p>
              <TimePicker
                value={endTime}
                format="A hh:mm"
                onChange={handleEndTimeChange}
                minuteStep={5}
                popupClassName="custom-timepicker-dropdown"
                placement="bottomLeft"
                suffixIcon={<IconNext className="w-[7px] h-[12px] rotate-90" />}
                allowClear={false}
                placeholder="종료 시간"
                disabledTime={() => ({
                  disabledHours: () =>
                    Array.from({ length: startTime.hour() }, (_, i) => i),
                  disabledMinutes: (hour) =>
                    hour === startTime.hour()
                      ? Array.from({ length: startTime.minute() }, (_, i) => i)
                      : [],
                })}
              />
            </div>
          </div>
          <div className="flex items-start space-x-[12px]">
            <label htmlFor="content" className="text-lg">
              설명
            </label>
            <textarea
              {...register("content", { required: true })}
              defaultValue={data?.content}
              className="w-[220px] lg:w-[381px] h-[133px] text-base bor rounded-md px-[10px] py-[6px] outline-none placeholder:text-[#C2BFBC]"
              placeholder="일정에 필요한 설명을 남겨보세요."
            />
          </div>
        </div>
        <div className="confirm_btn_container mt-[40px]">
          <button onClick={handleCancel} type="button" className="cancel">
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

export default TodoEditMode;
