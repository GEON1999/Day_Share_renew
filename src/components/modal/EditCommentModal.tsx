import { useMutation } from "@tanstack/react-query";
import useSearch from "@/hooks/useSearch";
import useCommentMutations from "@/queries/comment/useCommentMutations";
import { useForm } from "react-hook-form";

const EditCommentModal = ({ setIsOpen, commentId, content }: any) => {
  const id = useSearch.useSearchId();

  const { register, handleSubmit } = useForm();

  const { mutate: updateComment } = useMutation({
    mutationFn: useCommentMutations.updateComment,
  });

  const onSubmut = (data: any) => {
    updateComment(
      { calendarId: id, commentId, body: data },
      {
        onSuccess: (result) => {
          if (result) {
            alert("댓글 삭제에 성공하였습니다.");
          } else {
            alert("댓글 삭제에 실패하였습니다.");
          }
          window.location.reload();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmut)}
        className="bor  relative flex flex-col w-[400px] h-[300px] bg-[#EFDACC] rounded-xl p-8"
      >
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
        <input
          type="text"
          defaultValue={content}
          {...register("content")}
          className="w-full h-12 border-2 border-gray-300 rounded-md p-2"
        />

        <div className="flex items-center mt-5 space-x-5 justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4"
          >
            취소
          </button>
          <button
            type="submit"
            className="bg-[#E0CBB7] bor text-black w-32 h-12 rounded-md mt-4"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCommentModal;
