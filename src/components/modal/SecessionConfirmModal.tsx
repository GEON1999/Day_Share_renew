import { useMutation } from "@tanstack/react-query";
import useUserMutations from "@/queries/user/useUserMutations";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";

const SecessionConfirmModal = ({ setIsOpen }: any) => {
  const router = useRouter();

  const { mutate: deleteUser } = useMutation({
    mutationFn: useUserMutations.deleteUser,
  });

  const handleDeleteUser = () => {
    deleteUser(
      {},
      {
        onSuccess: (result) => {
          if (result) {
            alert("탈퇴에 성공하였습니다.");
          } else {
            alert("탈퇴에 실패하였습니다.");
          }
          deleteCookie("AccessToken");
          signOut();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bor  relative flex flex-col w-[600px] h-[550px] bg-[#EFDACC] rounded-xl p-8">
        <div className="flex justify-between p-4 items-center">
          <div></div>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="bg-[#E0CBB7] bor rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <h1 className="text-center mt-28">정말 탈퇴 하시겠습니까?</h1>
        <div className="flex items-center mt-5 space-x-5 justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4"
          >
            취소
          </button>
          <button
            onClick={handleDeleteUser}
            className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4"
          >
            탈퇴하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default SecessionConfirmModal;
