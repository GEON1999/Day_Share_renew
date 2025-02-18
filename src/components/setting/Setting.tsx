"use client";
import useUserQueries from "@/queries/user/useUserQueries";
import React, { useEffect, useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import useUserMutations from "@/queries/user/useUserMutations";
import SecessionConfirmModal from "@/components/modal/SecessionConfirmModal";
import ImageCropComponent from "@/components/common/ImageCropComponent";
import { IconSetting } from "@/icons";
import { useRouter } from "next/navigation";
import { useAlert } from "@/components/alert/AlertContext";

const Setting = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { showAlert } = useAlert();
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();

  const [userImg, setUserImg] = useState(userData?.img ?? "");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { mutate: updateUser } = useMutation({
    mutationFn: useUserMutations.updateUser,
  });

  const onSubmit = async (formData: any) => {
    if (formData?.name === "") {
      showAlert("이름을 입력해주세요.", "error");
      return;
    }
    if (formData?.name.length > 5) {
      showAlert("이름은 5자 이하로 입력해주세요.", "error");
      return;
    }
    const submitData = {
      name: formData.name,
      img: userImg,
    };

    updateUser(submitData, {
      onSuccess: (result: any) => {
        showAlert("프로필 정보 업데이트에 성공하였습니다.", "success");
        window.location.reload();
      },
      onError: (error) => {
        showAlert("프로필 정보 업데이트에 실패하였습니다.", "error");
      },
    });
  };

  useEffect(() => {
    if (errors.name) {
      showAlert(errors.name?.message?.toString(), "error");
    }
  }, [errors]);

  const handleChangePassword = () => router.push("/setting/changePW");
  const handleDeleteUser = () => setIsOpen(true);

  return (
    <div className="main_container px-[20px]">
      <div className="flex w-full h-screen justify-center items-center flex-col">
        <IconSetting className="w-5 h-5" />
        <h1 className="text-xl mt-2 lg:mt-0">설정</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center mt-[15px] lg:mt-[35px]"
        >
          <ImageCropComponent userImg={userImg} setUserImg={setUserImg} />
          <div className="flex flex-col mt-[20px] text-lg noto-sans-text">
            <input
              disabled
              className="w-[260px] lg:w-[390px] h-[40px] lg:h-[55px] bor px-[19px] rounded-md rounded-b-none focus:outline-none bg-[#EDEADF] cursor-not-allowed"
              defaultValue={userData?.email}
            />
            <input
              className="w-[260px] lg:w-[390px] h-[40px] lg:h-[55px] bor px-[19px] border-t-0 rounded-md rounded-t-none focus:outline-none"
              {...register("name", {
                required: "이름을 입력해주세요.",
              })}
              required
              autoFocus={true}
              placeholder={"name"}
              defaultValue={userData?.name}
            />
            <div className="relative">
              <input
                type="password"
                value={"123453453"}
                disabled
                className="mt-[10px] rounded-md w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] px-[19px] flex justify-center items-center bor cursor-not-allowed bg-[#ffffff] text-[#49494950] border-[#494949]"
              />
              <button
                type="button"
                className="absolute w-[100px] lg:w-[131px] h-[30px] right-[10px] lg:right-[17px] top-[15px] lg:top-[20px] text-base noto-sans-text border-[0.8px] border-[#49494950] rounded-full bg-[#49494910]"
                onClick={handleChangePassword}
              >
                비밀번호 변경
              </button>
            </div>

            <button
              type="submit"
              className="text-lg mt-[35px] rounded-md w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] flex justify-center items-center bor btn_hilight"
            >
              저장
            </button>
          </div>
        </form>

        <button
          className="text-base mt-[20px] noto-sans-text"
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

export default Setting;
