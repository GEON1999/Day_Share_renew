import useUserMutations from "@/queries/user/useUserMutations";
import { useMutation } from "@tanstack/react-query";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";

const ChangePasswordModal = ({ setIsOpen }: any) => {
  const { handleSubmit, register } = useForm();
  const { mutate: updatePassword } = useMutation({
    mutationFn: useUserMutations.updateUserPassword,
  });

  const onSubmit = async (formData: any) => {
    if (formData.newPassword !== formData.newPasswordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    const submitData = {
      oldPassword: formData.password,
      newPassword: formData.newPassword,
    };

    updatePassword(submitData, {
      onSuccess: (result: any) => {
        alert("성공");
        setIsOpen(false);
      },
      onError: (error: any) => {
        alert("실패");
      },
    });
  };

  return (
    <form
      className="flex flex-col items-center justify-center w-[600px] h-[550px] bg_depp rounded-xl p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        className="auth regular_input mt-3"
        type="password"
        {...register("password")}
      />
      <input
        className="auth regular_input mt-3"
        type="password"
        {...register("newPassword")}
      />
      <input
        className="auth regular_input mt-3"
        type="password"
        {...register("newPasswordCheck")}
      />
      <button className="auth submit_btn mt-9" type="submit">
        변경
      </button>
    </form>
  );
};

export default ChangePasswordModal;
