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
import { IconCamera, IconKakao_icon } from "@/icons";

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
            className="rounded-full bg-gray-200 w-60 h-60 mb-4 bor cur mt-10"
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
            className="rounded-full bg-gray-200 w-60 h-60 mb-4 bor cur bg-whiten mt-10 flex justify-center items-center"
          >
            <IconCamera className="w-45 h-45 mb-5" />
          </div>
        )}
        <input
          onInput={handleImageChange}
          type="file"
          className="hidden"
          id="imageUpload"
        />
        <div className="space-y-3 flex flex-col">
          <input
            className="border-[1.5px] border-[#7A7A7A] text-[#F6BEBE] rounded-xl w-[385px] h-[50px] outline-none bg-white mt-2 placeholder-[#D6B18D] px-4"
            {...register("name")}
            required
            autoFocus={true}
            placeholder={"이름"}
          />
          <input
            className="border-[1.5px] border-[#7A7A7A] text-[#F6BEBE] rounded-xl w-[385px] h-[50px] outline-none bg-white mt-2 placeholder-[#D6B18D] px-4"
            {...register("email")}
            required
            autoFocus={true}
            placeholder={"아이디"}
          />
          <input
            className="border-[1.5px] border-[#7A7A7A] text-[#F6BEBE] rounded-xl w-[385px] h-[50px] outline-none bg-white mt-2 placeholder-[#D6B18D] px-4"
            {...register("password")}
            type="password"
            required
            placeholder={"비밀번호"}
          />
          <input
            className="border-[1.5px] border-[#7A7A7A] text-[#F6BEBE] rounded-xl w-[385px] h-[50px] outline-none bg-white mt-2 placeholder-[#D6B18D] px-4"
            {...register("password_check")}
            type="password"
            required
            placeholder={"비밀번호 확인"}
          />
          <div>
            <button
              type={"submit"}
              className="border-[1.5px] border-[#7A7A7A] text-white rounded-xl w-[385px] h-[50px] outline-none bg-[#F6BEBE] font-black mt-6"
            >
              회원가입 완료
            </button>
            <button
              onClick={handleKakao}
              className="flex w-[385px] h-[50px] bg-[#FEE500] justify-center items-center border-[1.5px] border-[#7A7A7A] rounded-xl space-x-5 font-black mt-2"
            >
              <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241101154434_d6b143c9f54b4c45bee72babe3fbb067.png" />
              <span>카카오 계정으로 간편 로그인</span>
            </button>
          </div>
          <button onClick={handleLogin} className="text-[13px] text-[#7A7A7A]">
            로그인 페이지로
          </button>
        </div>
      </form>
    </div>
  );
}

export default SignupClientPage;
