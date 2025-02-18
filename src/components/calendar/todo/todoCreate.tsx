"use client";
import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconNext, IconX } from "@/icons";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { TimePicker } from "antd";
import { useAlert } from "@/components/alert/AlertContext";

const TodoCreate = ({
  setIsCalendarDateModalOpen,
  setIsOpen,
  refetch,
}: any) => {
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const [startTime, setStartTime] = useState<Dayjs>(
    dayjs(Number(date)).hour(10).minute(0)
  );
  const [endTime, setEndTime] = useState<Dayjs>(
    dayjs(Number(date)).hour(11).minute(0)
  );
  const [isSubmit, setIsSubmit] = useState(false);
  const { showAlert } = useAlert();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const { mutate: createTodo } = useMutation({
    mutationFn: useTodoMutations.createTodo,
  });

  const handleStartTimeChange = (value: any) => {
    setStartTime(value);
  };

  const handleEndTimeChange = (value: any) => {
    setEndTime(value);
  };

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

    createTodo(
      { calendarId: id, query: `date=${date}`, body: updatedData },
      {
        onSuccess: async (result: any) => {
          showAlert("일정이 등록되었습니다.", "success");
          await refetch();
          reset();
          setIsOpen(false);
          setIsCalendarDateModalOpen(true);
          setIsSubmit(false);
        },
        onError: () => {
          showAlert("일정 등록에 실패했습니다.", "error");
          setIsSubmit(false);
        },
      }
    );
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsCalendarDateModalOpen(true);
    reset();
  };

  return (
    <div className="absolute w-[490px] h-[737px] bg_depp bor rounded-md shadow_box top-0 z-50 p-[20px]  noto-sans-text">
      <div
        className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
        onClick={handleClose}
      >
        <IconX className="w-full h-full" />
      </div>
      <h1 className="-mt-[10px] text-[25px]">일정 등록</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col mt-[22px] justify-between h-[90%]"
      >
        <div>
          <div className="flex items-center space-x-[12px]">
            <label htmlFor="title" className="text-[20px]">
              제목
            </label>
            <input
              {...register("title", {
                required: true,
                maxLength: {
                  value: 10,
                  message: "제목은 10자 이하로 입력해주세요.",
                },
              })}
              type="text"
              className="w-[381px] h-[30px] text-[15px] bor rounded-md px-[10px] py-[6px] outline-none placeholder:text-[#C2BFBC]"
              placeholder="제목을 입력해 보세요."
            />
          </div>
          <p className="text-[15px] text-red mt-[10px]">
            {errors.title?.message?.toString()}
          </p>
          <div className="flex items-center my-[13px]">
            <label htmlFor="date" className="text-[20px]">
              일시
            </label>
            <input
              className="ml-[12px] w-[124px] h-[30px] text-[15px] bor rounded-md px-[8px] py-[6px] outline-none placeholder:text-[#C2BFBC] mr-[11px] disabled cursor-not-allowed text-center"
              disabled
              value={Helper.formatDateForTodoDetail(date, true)}
            />
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
            <p className="mx-[6px] text-[20px] font-medium font-satoshi">-</p>
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
          <div className="flex items-start space-x-[12px]">
            <label htmlFor="content" className="text-[20px]">
              설명
            </label>
            <textarea
              {...register("content", { required: true })}
              className="w-[381px] h-[133px] text-[15px] bor rounded-md px-[10px] py-[6px] outline-none placeholder:text-[#C2BFBC]"
              placeholder="일정에 필요한 설명을 남겨보세요."
            />
          </div>
        </div>
        <div className="confirm_btn_container mt-[40px]">
          <button onClick={handleClose} type="button" className="cancel">
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

export default TodoCreate;
