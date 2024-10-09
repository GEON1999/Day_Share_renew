"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

function LoginClientPage() {
  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const onSubmit = async (formData: any) => {
    console.log("formData:", formData);
    const result = await signIn("credentials", {
      redirect: false,
      id: formData.id,
      password: formData.password,
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

  return (
    <div>
      <h1>로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div>
          <div>
            <div>
              <input
                {...register("id")}
                required
                autoFocus={true}
                placeholder={"ID"}
              />
            </div>
          </div>

          <div className="">
            <div className="-mt-[10px]">
              <input
                {...register("password")}
                type="password"
                required
                placeholder={"password"}
              />
            </div>
          </div>

          <div>
            <button type={"submit"}>로그인</button>
          </div>
          <div>
            <button
              className="w-full transform rounded-md bg-gray-700 px-4 py-2 tracking-wide text-white transition-colors duration-200 hover:bg-gray-600 focus:bg-gray-600 focus:outline-none"
              onClick={handleKakao}
            >
              kakao login
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default LoginClientPage;
