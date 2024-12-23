import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { IconX } from "@/icons";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import useSearch from "@/hooks/useSearch";

const LeaveCalendar = ({ setIsOpen }: any) => {
  const router = useRouter();
  const id = useSearch.useSearchId();

  const { mutate: leaveCalendar } = useMutation({
    mutationFn: useCalendarMutations.leaveCalendar,
  });

  const handleLeaveCalendar = () => {
    leaveCalendar(id, {
      onSuccess: (result) => {
        alert("서버 탈퇴에 성공하였습니다.");
        router.push("/");
      },
      onError: (error) => {
        alert("서버 탈퇴에 실패하였습니다.");
      },
    });
  };

  const handleCancel = () => setIsOpen(false);

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bor relative flex flex-col w-[520px] h-[200px] bg_depp rounded-xl p-[20px] noto-sans-text">
        <IconX
          className="w-[10px] h-[10px] ml-auto cur"
          onClick={handleCancel}
        />
        <h1 className="text-center mt-[5px] text-[20px] font-bold ">
          정말 서버를 나가시겠습니까?
        </h1>
        <p className="text-center text-[15px]">
          서버를 나가시면 공유 달력 및 공유 일기등에 대한 <br />
          모든 정보가 삭제됩니다.
        </p>
        <div className="flex mt-[20px] text-[#494949] text-[20px] space-x-[10px] mx-auto">
          <button
            onClick={handleCancel}
            type="button"
            className="text-[#494949] font-[400] rounded-md bg-white w-[60px] h-[35px] bor hover:bg-[#EDEADF]"
          >
            취소
          </button>
          <button
            type="submit"
            onClick={handleLeaveCalendar}
            className="text-[#494949] font-[400] rounded-md bg-[#F6BEBE] w-[60px] h-[35px] bor hover:bg-[#F69D9D]"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default LeaveCalendar;
