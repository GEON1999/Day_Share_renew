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
    <section>
      <div className="">
        <div className="flex justify-between">
          <div className="flex items-center space-x-3">
            <h1 className="text-2xl">
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
        <div className="mt-[10px] bg_deep_2 h-[640px] w-[550px] rounded-md shadow_box bor overflow-hidden px-[25px] noto-sans-text">
          {calendarUser?.diaries?.length === 0 || !calendarUser?.diaries ? (
            <div className="flex h-full flex-col items-center">
              <p className="text-[#2D2D2E] text-[20px]">
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
                    className={`w-full h-[160px]  py-[19px] text-[20px] flex justify-between cur ${
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
                        className={`font-light mt-[2px] text-[#2D2D2E] pb-[27px] ${
                          diary.img ? "w-[350px]" : "w-[500px]"
                        } border-b border-[#49494920]`}
                      >
                        {Helper.cutString(diary.title, diary.img ? 18 : 22)}
                      </p>
                      <div className="flex space-x-3 text-[15px] mt-3 text-[#49494950]">
                        {Helper.formatDate(diary.createdAt)} 등록
                      </div>
                    </div>
                    {diary.img ? (
                      <img
                        src={diary.img}
                        alt="diary"
                        className="w-[118px] h-[118px] object-cover rounded-md bor"
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
