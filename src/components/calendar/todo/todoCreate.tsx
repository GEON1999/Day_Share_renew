import useSearch from "@/hooks/useSearch";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Helper from "@/helper/Helper";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";
import { TimePicker } from "antd";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { IconAdd, IconClose, IconNext } from "@/icons";
import locale from "antd/es/time-picker/locale/ko_KR";

const TodoCreate = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const { register, handleSubmit, setValue, watch } = useForm();
  const [startTime, setStartTime] = useState<Dayjs>(dayjs().hour(10).minute(0));
  const [endTime, setEndTime] = useState<Dayjs>(dayjs().hour(11).minute(0));

  const { mutate: createTodo } = useMutation({
    mutationFn: useTodoMutations.createTodo,
  });

  const handleCancel = () => router.push(`/calendar/${id}?date=${date}`);

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

  // TimePicker onChange 핸들러
  const handleStartTimeChange = (time: Dayjs | null) => {
    if (time) {
      setStartTime(time);
      setValue("startAt", time.format("HH:mm"));
    }
  };

  const handleEndTimeChange = (time: Dayjs | null) => {
    if (time) {
      setEndTime(time);
      setValue("endAt", time.format("HH:mm"));
    }
  };

  return (
    <div className="min-w-[600px] mt-[86px] w-[1270px] mx-auto">
      <div className="flex items-center space-x-[10px] ">
        <span className="text_red text-[20px]">일정 등록</span>
        <span className="text-[#999790] text-[16px]">|</span>
        <span
          onClick={handleCancel}
          className="text-[#999790] text-[16px] cur mt-[1px]"
        >
          이전으로 돌아가기
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="flex flex-col mt-[30px]">
          <input
            {...register("title")}
            className="border w-full h-[40px] outline-none rounded-md bg-transparent text-[20px] placeholder:text-[#495163] px-5"
            placeholder="제목을 입력해주세요"
          />
          <textarea
            {...register("content")}
            className="border-2 border-gray-400 w-full h-[135px] outline-none rounded mt-[30px] p-5 bg-transparent placeholder:text-[#495163] text-[20px]"
            placeholder="일정에 필요한 설명을 남기세요."
          />
          <div className="flex items-center justify-between">
            <div className="flex space-x-3 mt-[30px]">
              <label className="flex flex-col">
                시작 시간
                <TimePicker
                  value={startTime}
                  format="A HH:mm"
                  onChange={handleStartTimeChange}
                  minuteStep={5}
                  popupClassName="custom-timepicker-dropdown"
                  placement="bottomLeft"
                  suffixIcon={
                    <IconNext className="w-[7px] h-[12px] rotate-90" />
                  }
                  allowClear={false}
                />
              </label>
              <label className="flex flex-col">
                종료 시간
                <TimePicker
                  value={endTime}
                  format="A HH:mm"
                  onChange={handleEndTimeChange}
                  minuteStep={5}
                  popupClassName="custom-timepicker-dropdown"
                  placement="bottomLeft"
                  suffixIcon={
                    <IconNext className="w-[7px] h-[12px] rotate-90" />
                  }
                  allowClear={false}
                />
              </label>
            </div>
            <div className="flex items-center space-x-[10px] mt-[25px]">
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
          </div>
        </div>
      </form>
    </div>
  );
};

export default TodoCreate;
