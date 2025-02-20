import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { emotionData } from "@/app/data/emotionData";

const UserEmotion = () => {
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
    <section>
      <div
        className={`hidden lg:flex justify-between w-[580px] bor rounded-[30px] px-10 mt-[50px] mb-[40px] shadow_box ${
          calendarUser?.user_profile?.emotion === "EMPTY"
            ? "bg-white"
            : calendarUser?.user_profile?.emotion === "JOY"
            ? "bg-[#FFF8C6]"
            : calendarUser?.user_profile?.emotion === "SAD"
            ? "bg-[#E6FFCD]"
            : calendarUser?.user_profile?.emotion === "ANGRY"
            ? "bg-[#FFDCDC]"
            : "bg-[#CDE4F9]"
        }`}
      >
        {emotionData.map((emotion) => {
          return (
            <div key={emotion.id} className="flex flex-col items-center py-2">
              <img
                className="w-[70px] h-[70px] object-cover "
                src={emotion.imgSrc}
                alt="emotion"
              />
              <p
                className={`py-[2px] px-1 rounded-full w-[80px] text-center ${
                  calendarUser?.user_profile?.emotion === emotion.id
                    ? emotion.hoverTextColor
                    : "text-[#2D2D2E]"
                }`}
              >
                {emotion.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default UserEmotion;
