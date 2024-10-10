"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

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
    <div className="flex w-full h-screen bg-[#EFDACC] justify-center content-center items-center flex-col">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center"
      >
        <div>
          <img
            src={
              "https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1727864362722.jpg"
            }
            alt="logo"
            className="w-full h-full object-cover ml-2"
          />
        </div>

        <div className="space-y-3 flex flex-col">
          <input
            className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
            {...register("id")}
            required
            autoFocus={true}
            placeholder={"ID"}
          />
          <input
            className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
            {...register("password")}
            type="password"
            required
            placeholder={"password"}
          />

          <img
            onClick={handleKakao}
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728563922674.png"
            alt="kakao"
            className="w-60 h-10 border-2 rounded-md mt-4"
          />
          <button
            type={"submit"}
            className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg-[#F4EAE8]"
          >
            로그인
          </button>

          <button
            onClick={handleSignUp}
            className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg-[#F4EAE8] mt-2"
          >
            회원가입
          </button>
        </div>
      </form>
    </div>
  );
}

export default LoginClientPage;
