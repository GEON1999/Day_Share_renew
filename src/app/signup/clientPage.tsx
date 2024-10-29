"use client";
import React from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import useAuthMutations from "@/queries/auth/useAuthMutations";
import { useMutation } from "@tanstack/react-query";
import commonMutation from "@/queries/commonMutation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";

function SignupClientPage() {
  const [userImg, setUserImg] = React.useState("");
  const router = useRouter();

  const { handleSubmit, register } = useForm();

  const { mutate } = useMutation({
    mutationFn: useAuthMutations.signup,
  });

  const { mutate: imageMutate } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const onSubmit = debounce((formData: any) => {
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
      onSuccess: (result: any) => {
        router.push("/login");
      },
      onError: (error) => {
        alert("회원가입에 실패했습니다.");
      },
    });
  }, StaticKeys.DEBOUNCE_TIME);

  const handleKakao = async () => {
    await signIn("kakao", {
      redirect: true,
      callbackUrl: "/",
    });
  };

  const handleImageUpload = () => {
    document.getElementById("imageUpload")?.click();
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files[0];
    imageMutate(file, {
      onSuccess: (result: any) => {
        setUserImg(result.url);
      },
      onError: (error) => {
        alert("이미지 업로드에 실패했습니다.");
      },
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
            src={
              "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024185055_5c68aca703554836aff212384ba69795.png"
            }
            alt="logo"
            className="w-full h-full object-cover ml-2"
          />
        </div>
        {userImg !== "" ? (
          <div
            onClick={handleImageUpload}
            className="rounded-full bg-gray-200 w-40 h-40 mb-4 bor cur mt-10"
          >
            <img
              src={userImg}
              alt="profile"
              className="rounded-full w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            onClick={handleImageUpload}
            className="rounded-full bg-gray-200 w-40 h-40 mb-4 bor cur bg-whiten mt-10"
          ></div>
        )}
        <input
          onInput={handleImageChange}
          type="file"
          className="hidden"
          id="imageUpload"
        />
        <div className="space-y-3 flex flex-col">
          <input
            className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
            {...register("name")}
            required
            autoFocus={true}
            placeholder={"name"}
          />
          <input
            className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
            {...register("email")}
            required
            autoFocus={true}
            placeholder={"id"}
          />
          <input
            className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
            {...register("password")}
            type="password"
            required
            placeholder={"password"}
          />
          <input
            className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
            {...register("password_check")}
            type="password"
            required
            placeholder={"password check"}
          />

          <img
            onClick={handleKakao}
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1728563922674.png"
            alt="kakao"
            className="w-60 h-10 border-2 rounded-md mt-4"
          />
          <button
            type={"submit"}
            className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg_ligth"
          >
            회원가입 완료
          </button>

          <div>
            <button
              onClick={handleLogin}
              className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg_ligth mt-2"
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
