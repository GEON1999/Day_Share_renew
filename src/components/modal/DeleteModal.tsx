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
      <div className="bor relative flex flex-col w-[520px] h-[200px] bg_depp rounded-xl p-[20px] noto-sans-text">
        <div
          className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <IconX className="w-full h-full" />
        </div>
        <h1 className="text-center mt-[5px] text-[20px] font-bold ">{title}</h1>
        <p className="text-center text-[15px]">{msg}</p>
        <div className="flex mt-[20px] text-[#494949] text-[20px] space-x-[10px] mx-auto">
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="text-[#494949] font-[400] rounded-md bg-white w-[60px] h-[35px] bor hover:bg-[#EDEADF]"
          >
            취소
          </button>
          <button
            onClick={handleDelete}
            type="submit"
            className="text-[#494949] font-[400] rounded-md bg-[#F6BEBE] w-[60px] h-[35px] bor hover:bg-[#F69D9D]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
