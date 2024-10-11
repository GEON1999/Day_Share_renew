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
              className="rounded-full bg-gray-200 w-40 h-40 mb-4 border-black border-2 cur"
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
              className="rounded-full bg-gray-200 w-40 h-40 mb-4 border-black border-2 bg-whiten cur"
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
              disabled
              className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
              autoFocus={true}
              defaultValue={userData?.email}
            />
            <input
              className="border-2 border-gray-300 rounded-md w-60 h-10 px-4 py-2 outline-none"
              {...register("name")}
              required
              autoFocus={true}
              placeholder={"name"}
              defaultValue={userData?.name}
            />

            <button
              type={"submit"}
              className="border-2 rounded-md w-60 h-10 px-4 py-2 outline-none bg-[#F4EAE8]"
            >
              저장
            </button>
          </div>
        </form>
        <button className="relative top-80" onClick={handleDeleteUser}>
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
