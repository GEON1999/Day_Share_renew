"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconCheck_o, IconCheck_x, IconKakao, IconLogo } from "@/icons";
import { useAlert } from "@/components/alert/AlertContext";

function LoginClientPage() {
  const [isAutoLogin, setIsAutoLogin] = React.useState(false);
  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const { showAlert } = useAlert();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const onSubmit = async (formData: any) => {
    const result = await signIn("credentials", {
      redirect: false,
      id: formData.id,
      password: formData.password,
      callbackUrl: "/home",
      auto: isAutoLogin,
    });
    if (result?.ok) {
      showAlert("로그인에 성공했습니다.", "success");
      router.push("/home");
    } else if (result?.error) {
      showAlert(result?.error, "error");
    }
  };

  const handleKakao = async () => {
    await signIn("kakao", {
      redirect: true,
      callbackUrl: "/home",
    });
  };

  const handleSignUp = () => router.push("/signup");

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
        <IconLogo className="w-[120px] lg:w-[150px] h-[120px] lg:h-[150px]" />
        <div className="flex items-center flex-col mt-[45px]">
          <div className="w-[300px] lg:w-[390px] h-[110px] text_lg">
            <input
              className="auth-input-top"
              {...register("id")}
              required
              autoFocus={true}
              placeholder="아이디"
            />
            <input
              className="auth-input-bottom"
              {...register("password")}
              type="password"
              required
              placeholder="비밀번호"
            />
          </div>
          <div className="flex justify-between items-center w-[300px] lg:w-[390px]">
            <div className="flex items-center space-x-[5px]">
              {isAutoLogin ? (
                <IconCheck_o
                  onClick={() => setIsAutoLogin(false)}
                  className="w-[13px] h-[13px] mb-[1px]"
                />
              ) : (
                <IconCheck_x
                  onClick={() => setIsAutoLogin(true)}
                  className="w-[13px] h-[13px] mb-[1px]"
                />
              )}
              <label className="text-[13px] ">자동 로그인</label>
            </div>
            <button
              onClick={handleSignUp}
              className="text-[13px]"
              type="button"
            >
              회원가입
            </button>
          </div>
          <button type="submit" className="auth-submit-btn">
            로그인
          </button>
          <button
            type="button"
            onClick={handleKakao}
            className="auth-kakao-btn"
          >
            <IconKakao className="w-[24px] h-[22px]" />
            <span>카카오 계정으로 간편 로그인</span>
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginClientPage;
