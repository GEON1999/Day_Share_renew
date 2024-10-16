const DeleteModal = ({
  setIsOpen,
  mutateFn,
  msg = "정말 삭제하시겠습니까?",
}: any) => {
  const handleClickDeleteTodo = () => {
    mutateFn();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bor  relative flex flex-col w-[400px] h-[300px] bg_depp rounded-xl p-8">
        <div className="flex justify-between p-4 items-center">
          <div></div>
          <button
            onClick={() => setIsOpen(false)}
            type="button"
            className="bg_deeper bor rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100"
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
        <h1 className="text-center">{msg}</h1>
        <div className="flex items-center mt-5 space-x-5 justify-center">
          <button
            onClick={() => setIsOpen(false)}
            className="bg_deeper bor text-black w-32 h-12 rounded-md mt-4"
          >
            취소
          </button>
          <button
            onClick={handleClickDeleteTodo}
            className="bg_deeper bor text-black w-32 h-12 rounded-md mt-4"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
