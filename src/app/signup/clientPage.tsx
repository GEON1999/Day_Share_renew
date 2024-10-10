"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import useAuthMutations from "@/queries/auth/useAuthMutations";
import { useMutation } from "@tanstack/react-query";

function SignupClientPage() {
  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const { mutate } = useMutation({
    mutationFn: useAuthMutations.signup,
  });

  const onSubmit = async (formData: any) => {
    if (formData.password !== formData.password_check) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const submitData = { email: formData.id, password: formData.password };
    await mutate(submitData, {
      onSuccess: () => {
        router.push("/login");
      },
      onError: (error) => {
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
    <div className="flex w-full h-screen bg-[#EFDACC] justify-center content-center items-center flex-col">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="space-y-3">
          <div>
            <div>
              <input
                className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
                {...register("id")}
                required
                autoFocus={true}
                placeholder={"ID"}
              />
            </div>
          </div>
          <div className="">
            <div>
              <input
                className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
                {...register("password")}
                type="password"
                required
                placeholder={"password"}
              />
            </div>
          </div>
          <div className="">
            <div>
              <input
                className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
                {...register("password_check")}
                type="password"
                required
                placeholder={"password check"}
              />
            </div>
          </div>

          <div>
            <img
              onClick={handleKakao}
              src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728563922674.png"
              alt="kakao"
              className="w-60 h-10 border-2 rounded-md mt-4"
            />
          </div>
          <div>
            <button
              type={"submit"}
              className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg-[#F4EAE8]"
            >
              회원가입 완료
            </button>
          </div>

          <div>
            <button
              onClick={handleLogin}
              className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg-[#F4EAE8] mt-2"
            >
              로그인 페이지로
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default SignupClientPage;
