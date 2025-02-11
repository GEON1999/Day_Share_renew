import useSearch from "@/hooks/useSearch";
import { IconNextBig, IconX, IconEmptyTodo, IconEmptyDiary } from "@/icons";
import StaticKeys from "@/keys/StaticKeys";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import CalendarCreateContentPagination from "@/components/pagination/CalendarCreateContentPagination";
import { useRouter } from "next/navigation";
import Helper from "@/helper/Helper";
import { useState } from "react";
import ModalContainer from "@/components/modal/ModalContainer";
import ModalType from "@/keys/ModalType";
const CreateContentHome = ({
  contentType,
  setIsOpen,
}: {
  contentType: string;
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const [isCreateCalendar, setIsCreateCalendar] = useState(false);
  const router = useRouter();
  const currentPage = useSearch.useSearchCreateContentHomePage();
  const { data: calendarData, isLoading } =
    useCalendarQueries.useGetCalendarList(`page=${currentPage}`);
  console.log("calendarData :", calendarData);

  const handleClickCalendar = (calendarId: number) => {
    router.push(
      `/calendar/${calendarId}?date=${Helper.getTodayMs()}&content_type=${contentType}`
    );
  };

  const handleCreateCalendar = () => {
    setIsCreateCalendar(true);
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center noto-sans-text">
      <div className="w-[520px] h-[390px] bg_depp rounded-md p-[20px] text-[20px] relative">
        <div
          className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
          onClick={() => setIsOpen(false)}
        >
          <IconX className="w-full h-full" />
        </div>
        <h1 className="-mt-[5px] font-bold">
          {contentType === StaticKeys.DIARY ? "일기" : "일정"}를 추가할 달력
          선택
        </h1>
        {calendarData?.calendars?.length === 0 ? (
          <div className="flex items-center justify-center h-[300px] flex-col">
            {contentType === StaticKeys.DIARY ? (
              <IconEmptyDiary className="w-[200px] h-[200px]" />
            ) : (
              <IconEmptyTodo className="w-[200px] h-[200px]" />
            )}
            <p>달력을 먼저 만들어주세요.</p>
            <button
              className="rounded-md btn_hilight w-[300px] h-[50px] flex justify-center items-center bor mt-[30px]"
              onClick={handleCreateCalendar}
            >
              달력 만들기
            </button>
          </div>
        ) : (
          <>
            <div className="flex flex-col w-full space-y-[10px] mt-[27px]">
              {isLoading ? (
                <div className="loading spinner small" />
              ) : (
                <>
                  {calendarData?.calendars.map((calendar: any) => (
                    <div
                      className="flex items-center justify-between px-[14px] w-[470px] h-[50px] bor rounded-md cur hover:bg-[#f7eeab] transition-colors duration-200 ease-in-out"
                      key={calendar.id}
                      onClick={() => handleClickCalendar(calendar.id)}
                    >
                      <p className="ml-1">{calendar.name}</p>
                      <IconNextBig className="w-[5px] h-[10px]" />
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="absolute bottom-[25px] left-[50%] translate-x-[-50%]">
              <CalendarCreateContentPagination
                total_count={calendarData?.total_calendars}
              />
            </div>
          </>
        )}
      </div>
      {isCreateCalendar && (
        <ModalContainer
          setIsOpen={setIsCreateCalendar}
          initialModal={ModalType.ADD_CALENDAR}
        />
      )}
    </div>
  );
};

export default CreateContentHome;
