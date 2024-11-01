"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import commonMutation from "@/queries/commonMutation";
import useUserMutations from "@/queries/user/useUserMutations";
import SecessionConfirmModal from "@/components/modal/SecessionConfirmModal";
import { IconCamera } from "@/icons";

const Dashboard = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();
  console.log("userData :", userData);

  const [userImg, setUserImg] = useState(userData?.img ?? "");

  const { handleSubmit, register } = useForm();

  const { mutate: updateUser } = useMutation({
    mutationFn: useUserMutations.updateUser,
  });

  const { mutate: imageMutate } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const onSubmit = async (formData: any) => {
    console.log("formData :", formData);
    const submitData = {
      name: formData.name,
      img: userImg,
    };

    updateUser(submitData, {
      onSuccess: (result: any) => {
        alert("성공");
        window.location.reload();
      },
      onError: (error) => {
        alert("실패");
      },
    });
  };

  const handleDeleteUser = () => setIsOpen(true);

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

  return (
    <div className="main_container">
      <div className="flex w-full h-screen  justify-center content-center items-center flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
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
          <div className="flex flex-col mt-6">
            <input
              disabled
              className="auth rounded-xl px-4 bg-slate-300 bg-opacity-20 text-slate-500"
              defaultValue={userData?.email}
            />
            <input
              className="auth regular_input mt-3"
              {...register("name")}
              required
              autoFocus={true}
              placeholder={"name"}
              defaultValue={userData?.name}
            />

            <button type={"submit"} className="auth submit_btn mt-9">
              저장
            </button>
          </div>
        </form>
        <button className="sub_text mt-3" onClick={handleDeleteUser}>
          탈퇴하기
        </button>
      </div>
      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <SecessionConfirmModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </div>
  );
};

export default Dashboard;
