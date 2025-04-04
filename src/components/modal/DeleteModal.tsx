import { IconX } from "@/icons";

const DeleteModal = ({
  setIsOpen,
  mutateFn,
  msg = "삭제하게 되면 저장된 데이터는 복구할 수 없습니다.",
  title = "정말 삭제하시겠습니까?",
}: any) => {
  const handleDelete = () => {
    mutateFn();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bor relative flex flex-col w-[300px] lg:w-[520px] h-[174px] bg_depp rounded-md p-[20px] noto-sans-text">
        <div
          className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <IconX className="w-full h-full" />
        </div>
        <h1 className="text-center mt-[5px] text_lg font-bold ">{title}</h1>
        <p className="text-center text-[15px] mt-[6px]">{msg}</p>
        <div className="flex mt-[15px] text_lg space-x-[10px] mx-auto">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="modal_btn bg-white bor hover:bg-[#EDEADF]"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
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

export default DeleteModal;
