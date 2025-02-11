import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";

const UserProfileSection = () => {
  const calendarId = useSearch.useSearchId();
  const profileId = useSearch.useSearchProfileId();
  const diaryPage = useSearch.useSearchDiaryPage() ?? "1";
  const todoPage = useSearch.useSearchTodoPage() ?? "1";
  const query = `diary_page=${diaryPage}&todo_page=${todoPage}`;
  const { data: calendarUser } = useCalendarQueries.useGetCalendarUser(
    calendarId,
    profileId,
    query
  );

  return (
    <section className="flex justify-between space-x-20 items-center mb-[37px]">
      <div className="flex flex-col items-center space-y-4">
        <img
          src={
            calendarUser?.user_profile?.img === "" ||
            calendarUser?.user_profile?.img === null
              ? process.env.NEXT_PUBLIC_CALENDAR_IMG
              : calendarUser?.user_profile?.img
          }
          alt="user"
          className="w-[200px] h-[200px] object-cover rounded-full bor shadow_box"
        />
        {/* <button className="btn_hilight w-[200px] h-[37px] rounded-md bor">
                  채팅하기
                </button> */}
      </div>
      <div className="flex flex-col items-center space-y-5 text-[20px] w-[300px] ">
        <div className="flex items-center justify-between w-full">
          <div className="w-[100px] flex items-center justify-between">
            <p>이름 </p>
            <p>:</p>
          </div>
          <p className="">{calendarUser?.user_profile?.name}</p>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="w-[100px] flex items-center justify-between">
            <p>가입일 </p>
            <p>:</p>
          </div>
          <p className="">
            {Helper.formatDate(calendarUser?.user_profile?.createdAt)}
          </p>
        </div>
        <div className="flex items-center justify-between w-full">
          <div className="w-[100px] flex items-center justify-between">
            <p>총 게시물 </p>
            <p>:</p>
          </div>
          <p className="">
            {calendarUser?.total_diaries + calendarUser?.total_todos} 개
          </p>
        </div>
      </div>
    </section>
  );
};

export default UserProfileSection;
