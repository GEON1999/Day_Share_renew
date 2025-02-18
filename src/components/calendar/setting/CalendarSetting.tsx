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
import ModalWrapper from "@/components/modal/ModalWrapper";
import LeaveCalendar from "@/components/modal/LeaveCalendar";
import { useAlert } from "@/components/alert/AlertContext";

const CalendarSetting = () => {
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isInviteCodeSubmit, setIsInviteCodeSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const id = useSearch.useSearchId();
  const { data: calendarUserData, isLoading: calendarUserIsLoading } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  const { data: calendarData, isLoading: calendarIsLoading } =
    useCalendarQueries.useGetCalendarBasic(id);
  const { data: inviteCode, isLoading: inviteCodeLoading } =
    useCalendarQueries.useGetInviteCode(id);

  const { showAlert } = useAlert();

  const [calendarImg, setCalendarImg] = useState(calendarData?.img ?? "");

  const { handleSubmit, register } = useForm();

  const { mutate: updateCalendar } = useMutation({
    mutationFn: useCalendarMutations.updateCalendar,
  });
  const { mutate: createInviteCode } = useMutation({
    mutationFn: useCalendarMutations.createInviteCode,
  });

  const onSubmit = (data: any) => {
    if (isSubmit) return;
    if (data?.name === "") {
      showAlert("달력 이름을 입력해주세요.", "error");
      return;
    }
    if (data?.name.length > 10) {
      showAlert("달력 이름은 10자 이하로 입력해주세요.", "error");
      return;
    }
    setIsSubmit(true);
    const formData = { name: data.name, img: calendarImg };
    updateCalendar(
      { calendarId: id, body: formData },
      {
        onSuccess: (result) => {
          if (result) {
            showAlert("달력이 수정 되었습니다.", "success");
            window.location.reload();
          } else {
            showAlert("달력 수정에 실패하였습니다.", "error");
          }
          setIsSubmit(false);
        },
        onError: () => {
          setIsSubmit(false);
        },
      }
    );
  };

  const reloadInviteCode = () => {
    if (isInviteCodeSubmit) return;
    setIsInviteCodeSubmit(true);
    createInviteCode(id, {
      onSuccess: (result) => {
        if (result) {
          document.getElementById("inviteCode")!.value = result.code;
          showAlert("초대코드가 생성 되었습니다.", "success");
        } else {
          showAlert("초대코드 생성에 실패하였습니다.", "error");
        }
        setIsInviteCodeSubmit(false);
      },
      onError: (error) => {
        showAlert("초대코드 생성에 실패하였습니다.", "error");
        setIsInviteCodeSubmit(false);
      },
    });
  };

  const handleChangeProfile = () =>
    router.push(`/calendar/${id}/setting/changeProfile`);

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col ">
        <IconSetting className="w-5 h-5" />
        <h1 className="text-xl text-[#2D2D2E]">달력 설정</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[15px] lg:mt-[35px] noto-sans-text "
        >
          <CalendarImgCrop
            calendarImg={calendarImg}
            setCalendarImg={setCalendarImg}
          />
          <div className="flex flex-col mt-[15px] lg:mt-[20px] text-lg noto-sans-text ">
            <div className="flex flex-col space-y-[7px] lg:space-y-[13px]">
              <div className="flex flex-col space-y-[3px] items-start">
                <label className="text-lg">달력 이름</label>
                <input
                  className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md  focus:outline-none "
                  defaultValue={calendarData?.name}
                  {...register("name")}
                />
              </div>
              <div className="flex flex-col space-y-[3px] relative">
                <label className="text-lg">초대코드</label>
                <input
                  disabled
                  className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md  focus:outline-none "
                  defaultValue={inviteCode?.code}
                  id="inviteCode"
                />
                <IconReload
                  className="absolute right-[7px] lg:right-[16px] bottom-[10px] lg:bottom-[15px] w-[23px] h-[20px] cur"
                  onClick={reloadInviteCode}
                />
              </div>
              <div className="flex flex-col space-y-[3px] relative">
                <label className="text-lg">서버 프로필</label>
                <input
                  className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md  focus:outline-none text-opacity-10 cursor-not-allowed bg-white"
                  defaultValue={calendarUserData?.name ?? ""}
                  disabled
                />
                <button
                  className="absolute right-[6px] lg:right-[16px] bottom-[5px] lg:bottom-[10px] w-[109px] h-[30px] cur rounded-full border-[0.8px] border-[#49494950] text-base hover:bg-[#49494910] hover:border-[#49494950]"
                  onClick={handleChangeProfile}
                  type="button"
                >
                  프로필 변경
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="mt-[20px] lg:mt-[40px] rounded-md w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] flex justify-center items-center bor btn_hilight"
            >
              저장
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-[15px] text-base"
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
