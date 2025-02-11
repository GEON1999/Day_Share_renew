import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import UserProfileSection from "@/components/calendar/profile/userProfileSection";
import UserEmotion from "@/components/calendar/profile/userEmotion";
import UserTodoSection from "@/components/calendar/profile/userTodoSection";
import UserDiarySection from "@/components/calendar/profile/userDiarySection";

const CalendarUserProfile = () => {
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
    <div className="main_container py-[30px]">
      <h1 className="justify-center items-center flex text-[40px] mt-10">
        <span className=" bg_hilight px-1">
          {calendarUser?.user_profile?.name}
        </span>
        &nbsp;님의 프로필
      </h1>
      <div className="flex justify-between mt-20">
        <div className="flex flex-col  ">
          {/* 유저 프로필 */}
          <UserProfileSection />
          {/* 유저 감정 */}
          <UserEmotion />

          {/* 공유 일정 */}
          <UserTodoSection />
        </div>
        {/* 공유 일기 */}
        <UserDiarySection />
      </div>
    </div>
  );
};

export default CalendarUserProfile;
