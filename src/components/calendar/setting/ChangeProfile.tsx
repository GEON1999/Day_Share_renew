"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { IconSetting } from "@/icons";
import { useRouter } from "next/navigation";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useSearch from "@/hooks/useSearch";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import ImageCropComponent from "@/components/common/ImageCropComponent";

const ChangeProfile = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const { data: calendarUserData, isLoading: calendarUserIsLoading } =
    useCalendarQueries.useGetCalendarUserInfo(id);
  const [userImg, setUserImg] = useState(calendarUserData?.img ?? "");

  const { handleSubmit, register } = useForm();

  const { mutate: updateCalendarUserInfo } = useMutation({
    mutationFn: useCalendarMutations.updateCalendarUserInfo,
  });

  const onSubmit = (data: any) => {
    const formData = { name: data.name, img: userImg };
    updateCalendarUserInfo(
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

  const handleSetting = () => router.push(`/calendar/${id}/setting`);

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col ">
        <IconSetting className="w-5 h-5 cur" onClick={handleSetting} />
        <h1 className="text-[25px] text-[#2D2D2E] cur" onClick={handleSetting}>
          달력 설정
        </h1>
        <span className="text-[15px] font-satoshi font-[100] mt-[5px]">|</span>
        <h1 className="text-[20px] noto-sans-text">서버 프로필 변경</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[35px] noto-sans-text"
        >
          <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
          <div className="flex flex-col mt-[20px] text-[20px] noto-sans-text ">
            <div className="flex flex-col space-y-[13px]">
              <input
                className="w-[390px] h-[50px] bor px-[19px] rounded-md focus:outline-none"
                defaultValue={calendarUserData?.name}
                {...register("name")}
              />
            </div>
            <div className="confirm_btn_container mt-[40px]">
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
