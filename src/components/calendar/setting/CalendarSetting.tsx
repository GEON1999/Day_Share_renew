"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { IconReload, IconSetting } from "@/icons";
import { useRouter } from "next/navigation";
import CalendarImgCrop from "@/components/common/CalendarImgCrop";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useSearch from "@/hooks/useSearch";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import StaticKeys from "@/keys/StaticKeys";
import { debounce } from "lodash";
import ModalWrapper from "@/components/modal/ModalWrapper";
import LeaveCalendar from "@/components/modal/LeaveCalendar";

const CalendarSetting = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const id = useSearch.useSearchId();
  const { data: calendarUserData, isLoading: calendarUserIsLoading } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  const { data: calendarData, isLoading: calendarIsLoading } =
    useCalendarQueries.useGetCalendarBasic(id);
  console.log("calendarData : ", calendarData, calendarIsLoading);
  const { data: inviteCode, isLoading: inviteCodeLoading } =
    useCalendarQueries.useGetInviteCode(id);

  const [calendarImg, setCalendarImg] = useState(calendarData?.img ?? "");

  const { handleSubmit, register } = useForm();

  const { mutate: updateCalendar } = useMutation({
    mutationFn: useCalendarMutations.updateCalendar,
  });
  const { mutate: createInviteCode } = useMutation({
    mutationFn: useCalendarMutations.createInviteCode,
  });

  const onSubmit = (data: any) => {
    const formData = { name: data.name, img: calendarImg };
    updateCalendar(
      { calendarId: id, body: formData },
      {
        onSuccess: (result) => {
          if (result) {
            alert("달력이 수정 되었습니다.");
            window.location.reload();
          } else {
            alert(data?.data?.message ?? "달력 수정에 실패하였습니다.");
          }
        },
      }
    );
  };

  const reloadInviteCode = debounce(() => {
    createInviteCode(id, {
      onSuccess: (result) => {
        if (result) {
          document.getElementById("inviteCode")!.value = result.code;
          alert("초대코드가 생성 되었습니다.");
        } else {
          alert("초대코드 생성에 실패하였습니다.");
        }
      },
      onError: (error) => {
        alert("초대코드 생성에 실패하였습니다.");
      },
    });
  }, StaticKeys.DEBOUNCE_TIME);

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col ">
        <IconSetting className="w-5 h-5" />
        <h1 className="text-[25px] text-[#2D2D2E]">달력 설정</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[35px] noto-sans-text text-[#494949]"
        >
          <CalendarImgCrop
            calendarImg={calendarImg}
            setCalendarImg={setCalendarImg}
          />
          <div className="flex flex-col mt-[20px] text-[20px] noto-sans-text ">
            <div className="flex flex-col space-y-[13px]">
              <div className="flex flex-col space-y-[3px] items-start">
                <label className="text-[20px]">달력 이름</label>
                <input
                  className="w-[390px] h-[50px] bor px-[19px] rounded-md  focus:outline-none "
                  defaultValue={calendarData?.name}
                  {...register("name")}
                />
              </div>
              <div className="flex flex-col space-y-[3px] relative">
                <label className="text-[20px]">초대코드</label>
                <input
                  className="w-[390px] h-[50px] bor px-[19px] rounded-md  focus:outline-none "
                  defaultValue={inviteCode?.code}
                  id="inviteCode"
                />
                <IconReload
                  className="absolute right-[16px] bottom-[15px] w-[23px] h-[20px] cur"
                  onClick={reloadInviteCode}
                />
              </div>
              <div className="flex flex-col space-y-[3px] relative">
                <label className="text-[20px]">서버 프로필</label>
                <input
                  className="w-[390px] h-[50px] bor px-[19px] rounded-md  focus:outline-none text-opacity-10 cursor-not-allowed bg-white"
                  defaultValue={calendarUserData?.name ?? ""}
                  disabled
                />
                <button
                  className="absolute right-[16px] bottom-[10px] w-[109px] h-[30px] cur rounded-full border-[0.8px] border-[#49494950] text-[15px] hover:bg-[#49494910] hover:border-[#49494950]"
                  onClick={reloadInviteCode}
                >
                  프로필 변경
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="mt-[40px] text-[#494949] font-[400] rounded-md bg-[#F6BEBE] w-[390px] h-[50px] flex justify-center items-center bor hover:bg-[#F69D9D]"
            >
              저장
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-[15px] text-[15px]"
          >
            서버 나가기
          </button>
        </form>
      </div>
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <LeaveCalendar setIsOpen={setIsOpen} />
      </ModalWrapper>
    </div>
  );
};

export default CalendarSetting;
