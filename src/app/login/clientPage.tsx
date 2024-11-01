"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { IconKakao } from "@/icons";

function LoginClientPage() {
  const { data: session } = useSession();
  console.log("session:", session);

  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const onSubmit = async (formData: any) => {
    console.log("formData:", formData);
    const result = await signIn("credentials", {
      redirect: false,
      id: formData.id,
      password: formData.password,
      callbackUrl: "/",
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
    <div className="flex w-full h-screen bg_depp justify-center content-center items-center flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div>
          <img
            src={
              "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024185055_5c68aca703554836aff212384ba69795.png"
            }
            alt="logo"
            className="w-full h-full object-cover ml-2"
          />
        </div>

        <div className="flex flex-col mt-18">
          <div className="w-[385px] h-[130px] text-[18px]">
            <input
              className="border-[1.5px] border-[#7A7A7A] rounded-xl rounded-b-none  w-[385px] h-[65px] px-4 outline-none placeholder-[#D6B18D]"
              {...register("id")}
              required
              autoFocus={true}
              placeholder={"아이디"}
            />
            <input
              className="border-[1.5px] border-[#7A7A7A] border-t-0 rounded-xl rounded-t-none w-[385px] h-[65px] px-4 outline-none placeholder-[#D6B18D]"
              {...register("password")}
              type="password"
              required
              placeholder={"비밀번호"}
            />
          </div>
          <div className="mt-9 flex flex-col justify-center">
            <button
              type={"submit"}
              className="border-[1.5px] border-[#7A7A7A] text-white rounded-xl w-[385px] h-[50px] outline-none bg-[#F6BEBE] font-black"
            >
              로그인
            </button>
            <button
              type="button"
              onClick={handleSignUp}
              className="border-[1.5px] border-[#7A7A7A] text-[#F6BEBE] rounded-xl w-[385px] h-[50px] outline-none bg-white mt-2 font-black"
            >
              회원가입
            </button>
          </div>
          <div
            onClick={handleKakao}
            className="flex items-center space-x-4 justify-center mt-4 cur"
          >
            <IconKakao className="w-8 h-8" />
            <span className="text-[13px] text-[#7A7A7A] font-semibold">
              카카오 계정으로 로그인하기
            </span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginClientPage;
