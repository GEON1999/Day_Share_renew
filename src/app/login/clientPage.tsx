"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { IconCheck_o, IconCheck_x, IconKakao, IconLogo } from "@/icons";

function LoginClientPage() {
  const [isAutoLogin, setIsAutoLogin] = React.useState(false);
  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const onSubmit = async (formData: any) => {
    console.log("formData:", formData);
    const result = await signIn("credentials", {
      redirect: false,
      id: formData.id,
      password: formData.password,
      callbackUrl: "/",
      auto: isAutoLogin,
    });
    console.log("result:", result);
    if (result?.ok) {
      router.push("/");
    } else if (result?.error) {
      console.log("error:", result.error);
      alert("로그인에 실패했습니다.");
    }
  };

  const handleKakao = async () => {
    await signIn("kakao", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  const handleSignUp = () => router.push("/signup");

  return (
    <div className="flex w-full h-screen bg_depp justify-center content-center items-center flex-col noto-sans-text">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <IconLogo className="w-[150px] h-[150px]" />
        <div className="flex flex-col mt-[45px]">
          <div className="w-[390px] h-[110px] text-[18px]">
            <input
              className="w-[390px] h-[55px] bor px-[19px] rounded-md rounded-b-none placeholder:text-[#C2BFBC]"
              {...register("id")}
              required
              autoFocus={true}
              placeholder={"아이디"}
            />
            <input
              className="w-[390px] h-[55px] bor px-[19px] border-t-0 rounded-md rounded-t-none placeholder:text-[#C2BFBC]"
              {...register("password")}
              type="password"
              required
              placeholder={"비밀번호"}
            />
          </div>
          <div className="flex justify-between items-center mt-[10px]">
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
              <label className="text-[13px] text-[#494949] font-[400] ">
                자동 로그인
              </label>
            </div>
            <button
              onClick={handleSignUp}
              className="text-[13px] text-[#494949] font-[400]"
              type="button"
            >
              회원가입
            </button>
          </div>
          <button
            type="submit"
            className="mt-[35px] text-[#494949] font-[400] rounded-md bg-[#F6BEBE] w-[390px] h-[50px] flex justify-center items-center bor"
          >
            로그인
          </button>
          <div className="flex items-center space-x-[7px] justify-center mt-5 cur">
            <div
              onClick={handleKakao}
              className="w-[30px] h-[30px] rounded-full bg-transparent grid place-items-center border"
            >
              <IconKakao className="w-[16.88px] h-[15px] translate-y-[0.5px]" />
            </div>
            <span
              onClick={handleKakao}
              className="text-[15px] text-[#494949] font-[400]"
            >
              카카오 계정으로 로그인하기
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginClientPage;
