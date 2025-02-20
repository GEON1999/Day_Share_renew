import { useMutation } from "@tanstack/react-query";
import useUserMutations from "@/queries/user/useUserMutations";
import { signOut } from "next-auth/react";
import { IconX } from "@/icons";
import { useAlert } from "@/components/alert/AlertContext";
const SecessionConfirmModal = ({ setIsOpen }: any) => {
  const { showAlert } = useAlert();
  const { mutate: deleteUser } = useMutation({
    mutationFn: useUserMutations.deleteUser,
  });

  const handleDeleteUser = () => {
    deleteUser(
      {},
      {
        onSuccess: (result) => {
          if (result) {
            showAlert("탈퇴에 성공하였습니다.", "success");
          } else {
            showAlert("탈퇴에 실패하였습니다.", "error");
          }
          signOut();
        },
        onError: () => {
          showAlert("탈퇴에 실패하였습니다.", "error");
        },
      }
    );
  };

  const handleCancel = () => setIsOpen(false);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bor relative flex flex-col w-[300px] lg:w-[520px] h-[200px] bg_depp rounded-md p-[20px] noto-sans-text">
        <div
          className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
          onClick={handleCancel}
        >
          <IconX className="w-full h-full" />
        </div>
        <h1 className="text-center mt-[5px] text-lg font-bold ">
          정말 탈퇴 하시겠습니까?
        </h1>
        <p className="text-center text-base mt-[6px]">
          탈퇴하시면 공유 달력 및 공유 일기등에 대한 <br />
          모든 정보가 삭제됩니다.
        </p>
        <div className="flex mt-[15px] text-lg space-x-[10px] mx-auto">
          <button
            onClick={handleCancel}
            type="button"
            className="modal_btn bg-white bor hover:bg-[#EDEADF]"
          >
            취소
          </button>
          <button
            onClick={handleDeleteUser}
            type="submit"
            className="modal_btn bg-[#F6BEBE] bor hover:bg-[#F69D9D]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecessionConfirmModal;
