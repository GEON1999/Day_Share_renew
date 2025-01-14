"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useUserMutations from "@/queries/user/useUserMutations";
import { IconSetting } from "@/icons";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/alert/AlertContext";

const ChangePassword = () => {
  const router = useRouter();
  const { showAlert } = useAlert();
  const { handleSubmit, register } = useForm();

  const { mutate: updatePassword } = useMutation({
    mutationFn: useUserMutations.updateUserPassword,
  });

  const onSubmit = async (formData: any) => {
    if (formData.password !== formData.password_check) {
      showAlert("비밀번호가 일치하지 않습니다.", "error");
      return;
    }
    const submitData = {
      oldPassword: formData.oldPassword,
      newPassword: formData.password,
    };

    updatePassword(submitData, {
      onSuccess: (result: any) => {
        showAlert("비밀번호 변경에 성공하였습니다.", "success");
        router.push("/setting");
      },
      onError: (error: any) => {
        showAlert("비밀번호 변경에 실패하였습니다.", "error");
      },
    });
  };

  const handleSetting = () => {
    router.push("/setting");
  };

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col ">
        <IconSetting onClick={handleSetting} className="w-5 h-5 cur" />
        <h1 onClick={handleSetting} className="text-[25px] cur text-[#2D2D2E]">
          설정
        </h1>
        <span className="text-[15px] font-satoshi font-[100] mt-[5px]">|</span>
        <h1 className="text-[20px] noto-sans-text">비밀번호 변경</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[35px] noto-sans-text"
        >
          <input
            className="w-[390px] h-[50px] outline-none border border-b-0 rounded-t-md px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("oldPassword")}
            required
            placeholder="기존 비밀번호"
          />

          <input
            className="w-[390px] h-[50px] outline-none border border-b-0 px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("password")}
            type="password"
            required
            placeholder="새 비밀번호"
          />
          <input
            className="w-[390px] h-[50px] outline-none border rounded-b-md px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("password_check")}
            type="password"
            required
            placeholder="새 비밀번호 확인"
          />
          <div className="flex mt-[40px]  text-[20px] noto-sans-text space-x-[10px]">
            <button
              onClick={handleSetting}
              type="button"
              className=" rounded-md bg-white w-[60px] h-[35px] bor hover:bg-[#49494910]"
            >
              취소
            </button>
            <button
              type="submit"
              className=" rounded-md bg-[#F6BEBE] w-[60px] h-[35px] bor hover:bg-[#F69D9D]"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
