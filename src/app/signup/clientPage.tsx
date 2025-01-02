"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import useAuthMutations from "@/queries/auth/useAuthMutations";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ImageCropComponent from "@/components/common/ImageCropComponent";
import { IconKakao, IconLogo, IconLogoHoriz } from "@/icons";

function SignupClientPage() {
  const [userImg, setUserImg] = useState("");
  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const { mutate } = useMutation({
    mutationFn: useAuthMutations.signup,
  });

  const onSubmit = (formData: any) => {
    if (formData.password !== formData.password_check) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const submitData = {
      email: formData.email,
      password: formData.password,
      name: formData.name,
      img: userImg,
    };
    mutate(submitData, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: () => {
        alert("회원가입에 실패했습니다.");
      },
    });
  };

  const handleKakao = async () => {
    await signIn("kakao", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  const handleLogin = () => router.push("/login");

  return (
    <div className="flex w-full h-screen bg_depp justify-center content-center items-center flex-col noto-sans-text">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <IconLogoHoriz
          className="w-[250px] h-[57.75px] cur"
          onClick={handleLogin}
        />
        <h1 className="text-[20px] mt-[9.25px] font-bold text-[#494949] mb-[40px]">
          회원가입
        </h1>
        <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
        <div className="flex flex-col mt-[20px] text-[20px]">
          <input
            className="w-[390px] h-[50px] outline-none border border-b-0 rounded-t-md px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("name")}
            required
            placeholder="이름"
          />
          <input
            className="w-[390px] h-[50px] outline-none border border-b-0 px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("email")}
            required
            placeholder="아이디"
          />
          <input
            className="w-[390px] h-[50px] outline-none border border-b-0 px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("password")}
            type="password"
            required
            placeholder="비밀번호"
          />
          <input
            className="w-[390px] h-[50px] outline-none border rounded-b-md px-[19px] placeholder-[#C2BFBC] focus:outline-none"
            {...register("password_check")}
            type="password"
            required
            placeholder="비밀번호 확인"
          />
          <div>
            <button
              type="submit"
              className="text-[#494949] rounded-md bg-[#F6BEBE] mt-[40px] w-[390px] h-[50px] flex justify-center items-center bor"
            >
              회원가입
            </button>
            <button
              onClick={handleKakao}
              className="flex bg-[#FEE500] justify-center items-center rounded-md space-x-5 text-[#494949] mt-[10px] w-[390px] h-[50px] bor"
            >
              <IconKakao className="w-[24px] h-[22px]" />
              <span>카카오 계정으로 간편 로그인</span>
            </button>
          </div>
          <button
            type="button"
            onClick={handleLogin}
            className="text-[#494949] text-[15px] mt-[10px]"
          >
            로그인 페이지로 이동
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupClientPage;
