"use client";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { IconSetting } from "@/icons";
import { useRouter } from "next/navigation";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useSearch from "@/hooks/useSearch";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import ImageCropComponent from "@/components/common/ImageCropComponent";
import { useAlert } from "@/components/alert/AlertContext";

const ChangeProfile = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const { data: calendarUserData, isLoading: calendarUserIsLoading } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  const [userImg, setUserImg] = useState(calendarUserData?.img ?? "");
  const [isSubmit, setIsSubmit] = useState(false);
  const { showAlert } = useAlert();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { mutate: updateCalendarUserInfo } = useMutation({
    mutationFn: useCalendarMutations.updateCalendarUserInfo,
  });

  const onSubmit = (data: any) => {
    if (isSubmit) return;
    if (data?.name === "") {
      showAlert("이름을 입력해주세요.", "error");
      return;
    }
    if (data?.name.length > 5) {
      showAlert("이름은 5자 이하로 입력해주세요.", "error");
      return;
    }
    setIsSubmit(true);
    const formData = { name: data.name, img: userImg };
    updateCalendarUserInfo(
      { calendarId: id, body: formData },
      {
        onSuccess: (result) => {
          if (result) {
            showAlert("달력 프로필이 수정 되었습니다.", "success");
            window.location.reload();
            setIsSubmit(false);
          } else {
            showAlert("달력 프로필 수정에 실패하였습니다.", "error");
            setIsSubmit(false);
          }
        },
        onError: () => {
          setIsSubmit(false);
        },
      }
    );
  };

  useEffect(() => {
    if (errors.name) {
      showAlert(errors.name?.message?.toString(), "error");
    }
  }, [errors]);

  const handleSetting = () => router.push(`/calendar/${id}/setting`);

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col ">
        <IconSetting className="w-5 h-5 cur" onClick={handleSetting} />
        <h1 className="text_xl text-[#2D2D2E] cur" onClick={handleSetting}>
          달력 설정
        </h1>
        <span className="text_base font-satoshi font-[100] mt-[5px]">|</span>
        <h1 className="text_lg noto-sans-text">서버 프로필 변경</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[15px] lg:mt-[35px] noto-sans-text"
        >
          <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
          <div className="flex flex-col mt-[15px] lg:mt-[20px] text_lg noto-sans-text ">
            <div className="flex flex-col space-y-[13px]">
              <input
                className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md focus:outline-none"
                defaultValue={calendarUserData?.name}
                {...register("name", {
                  required: "이름을 입력해주세요.",
                })}
              />
            </div>
            <div className="confirm_btn_container mt-[20px] lg:mt-[40px]">
              <button onClick={handleSetting} type="button" className="cancel">
                취소
              </button>
              <button type="submit" className="confirm">
                저장
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangeProfile;
