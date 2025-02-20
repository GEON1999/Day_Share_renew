import Helper from "@/helper/Helper";
import { IconEmptyDiary } from "@/icons";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useRouter } from "next/navigation";
import DiaryPagination from "@/components/pagination/diaryPagination";

const UserDiarySection = () => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const profileId = useSearch.useSearchProfileId();
  const diaryPage = useSearch.useSearchDiaryPage() ?? "1";
  const todoPage = useSearch.useSearchTodoPage() ?? "1";
  const query = `diary_page=${diaryPage}&todo_page=${todoPage}`;
  const date = useSearch.useSearchDate();

  const { data: calendarUser } = useCalendarQueries.useGetCalendarUser(
    calendarId,
    profileId,
    query
  );

  const handleClickDiary = (id: number) => {
    router.push(`/calendar/${calendarId}/diary/${id}?date=${date}`);
  };
  return (
    <section className="mt-[15px] lg:mt-0">
      <div className="">
        <div className="flex justify-between items-center lg:items-start">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg lg:text-2xl">
              {calendarUser?.user_profile?.name}님의 일기
            </h1>
          </div>
          <div>
            <DiaryPagination
              total_count={calendarUser?.total_diaries}
              page={diaryPage}
            />
          </div>
        </div>
        <div className="mt-[10px] bg_deep_2 h-[520px] lg:h-[640px] w-[300px] lg:w-[550px] rounded-md shadow_box bor overflow-hidden px-[25px] noto-sans-text">
          {calendarUser?.diaries?.length === 0 || !calendarUser?.diaries ? (
            <div className="flex h-full flex-col items-center">
              <p className="text-[#2D2D2E] text-lg">
                <span className="relative top-[130px] right-[45px]">
                  작성하신 일기가
                </span>
                <span className="relative top-[167px] left-[45px]">
                  없습니다.
                </span>
              </p>
              <p></p>
              <IconEmptyDiary className="w-[220px] h-[161.21px] mt-[154px]" />
            </div>
          ) : (
            calendarUser?.diaries?.map((diary: any, index: number) => {
              return (
                <div onClick={() => handleClickDiary(diary.id)} key={diary.id}>
                  <div
                    className={`w-full h-[130px] lg:h-[160px] py-[10px] lg:py-[19px] text-lg flex justify-between cur ${
                      index != 3 ? "border-b border-[#49494950]" : ""
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <img
                          src={
                            calendarUser.user_profile.img == "" ||
                            calendarUser.user_profile.img == null
                              ? process.env.NEXT_PUBLIC_PROFILE_IMG
                              : calendarUser.user_profile.img
                          }
                          alt="profile"
                          className="w-[25px] h-[25px] rounded-full bor object-cover"
                        />
                        <p>{calendarUser.user_profile.name}</p>
                      </div>
                      <p
                        className={`font-light mt-[2px] text-[#2D2D2E] pb-[20px] lg:pb-[27px] ${
                          diary.img
                            ? "w-[150px] lg:w-[350px]"
                            : "w-[250px] lg:w-[500px]"
                        } border-b border-[#49494920]`}
                      >
                        {Helper.cutString(diary.title, diary.img ? 12 : 19)}
                      </p>
                      <div className="flex lg:space-x-3 text-base mt-1 lg:mt-3 text-[#49494950]">
                        {Helper.formatDate(diary.createdAt)} 등록
                      </div>
                    </div>
                    {diary.img ? (
                      <img
                        src={diary.img}
                        alt="diary"
                        className="w-[100px] lg:w-[118px] h-[100px] lg:h-[118px] object-cover rounded-md bor"
                      />
                    ) : null}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default UserDiarySection;
