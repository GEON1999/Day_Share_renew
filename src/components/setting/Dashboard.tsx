"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useUserMutations from "@/queries/user/useUserMutations";
import SecessionConfirmModal from "@/components/modal/SecessionConfirmModal";
import ImageCropComponent from "../common/ImageCropComponent";
import { IconSetting } from "@/icons";
import { useRouter } from "next/navigation";

const Dashboard = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const [userImg, setUserImg] = useState(userData?.img ?? "");

  const { handleSubmit, register } = useForm();

  const { mutate: updateUser } = useMutation({
    mutationFn: useUserMutations.updateUser,
  });

  const onSubmit = async (formData: any) => {
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

  const handleChangePassword = () => router.push("/setting/changePW");
  const handleDeleteUser = () => setIsOpen(true);

  return (
    <div className="main_container">
      <div className="flex w-full h-screen justify-center items-center flex-col">
        <IconSetting className="w-5 h-5" />
        <h1 className="text-[25px] ">설정</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[35px]"
        >
          <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
          <div className="flex flex-col mt-[20px] text-[#494949] text-[20px] noto-sans-text">
            <input
              disabled
              className="w-[390px] h-[55px] bor px-[19px] rounded-md rounded-b-none focus:outline-none bg-[#EDEADF]"
              defaultValue={userData?.email}
            />
            <input
              className="w-[390px] h-[55px] bor px-[19px] border-t-0 rounded-md rounded-t-none focus:outline-none"
              {...register("name")}
              required
              autoFocus={true}
              placeholder={"name"}
              defaultValue={userData?.name}
            />
            <button
              type="submit"
              className="mt-[35px] text-[#494949] font-[400] rounded-md bg-[#F6BEBE] w-[390px] h-[50px] flex justify-center items-center bor hover:bg-[#F69D9D]"
            >
              저장
            </button>
          </div>
        </form>
        <button
          className="text-[15px] text-[#494949] mt-[20px] noto-sans-text"
          onClick={handleChangePassword}
        >
          비밀번호 변경
        </button>
        <button
          className="text-[15px] text-[#494949] mt-[4px] noto-sans-text"
          onClick={handleDeleteUser}
        >
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
