"use client";
import React, { useState, useCallback, useMemo } from "react";
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
import InviteCodeSection from "@/components/calendar/setting/inviteCodeSection";
import ProfileSection from "@/components/calendar/setting/profileSection";

interface CalendarFormData {
  name: string;
}

const CalendarSetting = () => {
  const router = useRouter();
  const [isSubmit, setIsSubmit] = useState(false);
  const [isInviteCodeSubmit, setIsInviteCodeSubmit] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { showAlert } = useAlert();

  const id = useSearch.useSearchId();

  const { data: calendarUserData } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  const { data: calendarData } = useCalendarQueries.useGetCalendarBasic(id);
  const { data: inviteCode } = useCalendarQueries.useGetInviteCode(id);

  const [calendarImg, setCalendarImg] = useState(calendarData?.img ?? "");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<CalendarFormData>({
    defaultValues: {
      name: calendarData?.name || "",
    },
  });

  // 뮤테이션
  const { mutate: updateCalendar } = useMutation({
    mutationFn: useCalendarMutations.updateCalendar,
  });

  const { mutate: createInviteCode } = useMutation({
    mutationFn: useCalendarMutations.createInviteCode,
  });

  const onSubmit = useCallback(
    (data: CalendarFormData) => {
      if (isSubmit) return;

      if (data.name === "") {
        showAlert("달력 이름을 입력해주세요.", "error");
        return;
      }

      if (data.name.length > 10) {
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
            showAlert("달력 수정에 실패하였습니다.", "error");
            setIsSubmit(false);
          },
        }
      );
    },
    [isSubmit, calendarImg, id, updateCalendar, showAlert]
  );

  const reloadInviteCode = useCallback(() => {
    if (isInviteCodeSubmit) return;

    setIsInviteCodeSubmit(true);
    createInviteCode(id, {
      onSuccess: (result) => {
        if (result) {
          const inviteCodeInput = document.getElementById(
            "inviteCode"
          ) as HTMLInputElement;
          if (inviteCodeInput) {
            inviteCodeInput.value = result.code;
          }
          showAlert("초대코드가 생성 되었습니다.", "success");
        } else {
          showAlert("초대코드 생성에 실패하였습니다.", "error");
        }
        setIsInviteCodeSubmit(false);
      },
      onError: () => {
        showAlert("초대코드 생성에 실패하였습니다.", "error");
        setIsInviteCodeSubmit(false);
      },
    });
  }, [isInviteCodeSubmit, id, createInviteCode, showAlert]);

  const handleChangeProfile = useCallback(
    () => router.push(`/calendar/${id}/setting/changeProfile`),
    [router, id]
  );

  const isButtonDisabled = useMemo(
    () => isSubmit || (!calendarData?.name && !calendarImg),
    [isSubmit, calendarData?.name, calendarImg]
  );

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col">
        <IconSetting className="w-5 h-5" />
        <h1 className="text_xl text-[#2D2D2E]">달력 설정</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[15px] lg:mt-[35px] noto-sans-text"
        >
          <CalendarImgCrop
            calendarImg={calendarImg}
            setCalendarImg={setCalendarImg}
          />

          <div className="flex flex-col mt-[15px] lg:mt-[20px] text_lg noto-sans-text">
            <div className="flex flex-col space-y-[7px] lg:space-y-[13px]">
              <div className="flex flex-col space-y-[3px] items-start">
                <label className="text_lg">달력 이름</label>
                <input
                  className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md focus:outline-none"
                  defaultValue={calendarData?.name}
                  placeholder="달력 이름을 입력해주세요"
                  {...register("name")}
                />
              </div>

              <InviteCodeSection
                inviteCode={inviteCode}
                reloadInviteCode={reloadInviteCode}
                isInviteCodeSubmit={isInviteCodeSubmit}
              />

              <ProfileSection
                calendarUserData={calendarUserData}
                handleChangeProfile={handleChangeProfile}
              />
            </div>

            <button
              type="submit"
              disabled={isButtonDisabled}
              className={`mt-[20px] lg:mt-[40px] rounded-md w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] flex justify-center items-center bor ${
                isButtonDisabled
                  ? "opacity-50 cursor-not-allowed"
                  : "btn_hilight"
              }`}
            >
              {isSubmit ? "저장 중..." : "저장"}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="mt-[15px] text_base"
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
