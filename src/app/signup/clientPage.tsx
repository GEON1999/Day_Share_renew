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
    <div className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <IconLogoHoriz
          className="w-[250px] h-[57.75px] cur"
          onClick={handleLogin}
        />
        <h1 className="auth-title">회원가입</h1>
        <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
        <div className="flex flex-col mt-[20px] text-[20px]">
          <input
            className="auth-input-top"
            {...register("name")}
            required
            placeholder="이름"
          />
          <input
            className="auth-input-middle"
            {...register("email")}
            required
            placeholder="아이디"
          />
          <input
            className="auth-input-middle"
            {...register("password")}
            type="password"
            required
            placeholder="비밀번호"
          />
          <input
            className="auth-input-bottom"
            {...register("password_check")}
            type="password"
            required
            placeholder="비밀번호 확인"
          />
          <div>
            <button type="submit" className="auth-submit-btn">
              회원가입
            </button>
            <button onClick={handleKakao} className="auth-kakao-btn">
              <IconKakao className="w-[24px] h-[22px]" />
              <span>카카오 계정으로 간편 로그인</span>
            </button>
          </div>
          <button type="button" onClick={handleLogin} className="auth-link-btn">
            로그인 페이지로 이동
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupClientPage;
