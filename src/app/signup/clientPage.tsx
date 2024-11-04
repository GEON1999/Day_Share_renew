"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import useAuthMutations from "@/queries/auth/useAuthMutations";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ImageCropComponent from "@/components/ImageCropComponent";

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
    <div className="flex w-full h-screen bg_depp justify-center content-center items-center flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div>
          <img
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024185055_5c68aca703554836aff212384ba69795.png"
            alt="logo"
            className="w-full h-full object-cover ml-2"
          />
        </div>
        <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
        <div className="space-y-3 flex flex-col">
          <input
            className="auth regular_input"
            {...register("name")}
            required
            placeholder="이름"
          />
          <input
            className="auth regular_input"
            {...register("email")}
            required
            placeholder="아이디"
          />
          <input
            className="auth regular_input"
            {...register("password")}
            type="password"
            required
            placeholder="비밀번호"
          />
          <input
            className="auth regular_input"
            {...register("password_check")}
            type="password"
            required
            placeholder="비밀번호 확인"
          />
          <div>
            <button type="submit" className="auth submit_btn mt-6">
              회원가입 완료
            </button>
            <button
              onClick={handleKakao}
              className="auth flex bg-[#FEE500] justify-center items-center rounded-xl space-x-5 font-black mt-2"
            >
              <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241101154434_d6b143c9f54b4c45bee72babe3fbb067.png" />
              <span>카카오 계정으로 간편 로그인</span>
            </button>
          </div>
          <button type="button" onClick={handleLogin} className="sub_text">
            로그인 페이지로
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupClientPage;
