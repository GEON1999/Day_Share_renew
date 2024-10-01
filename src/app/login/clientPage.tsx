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
        </div>
      </form>
    </div>
  );
}

export default LoginClientPage;
