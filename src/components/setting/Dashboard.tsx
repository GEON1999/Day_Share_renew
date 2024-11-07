"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useUserMutations from "@/queries/user/useUserMutations";
import SecessionConfirmModal from "@/components/modal/SecessionConfirmModal";
import ImageCropComponent from "../common/ImageCropComponent";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const [userImg, setUserImg] = useState(userData?.img ?? "");

  const { handleSubmit, register } = useForm();

  const { mutate: updateUser } = useMutation({
    mutationFn: useUserMutations.updateUser,
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

  return (
    <div className="main_container">
      <div className="flex w-full h-screen  justify-center content-center items-center flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center"
        >
          <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
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
