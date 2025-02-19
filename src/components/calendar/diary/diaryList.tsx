import CalendarDiaryPagination from "@/components/pagination/calendarDiaryPagination";
import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconAdd, IconComment, IconEmptyDiary, IconHeart } from "@/icons";
import StaticKeys from "@/keys/StaticKeys";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import { useModalStore } from "@/store/modalStore";
import { useRouter } from "next/navigation";

const DiaryList = () => {
  const { isCalendarDateModalOpen } = useModalStore();
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const calendarDiaryPage = useSearch.useSearchCalendarDiaryPage();
  const contentType = useSearch.useSearchContentType();

  const { data: diaryData, isLoading: diaryIsLoading } =
    useDiaryQueries.useGetDiaries(
      calendarId,
      `date=${date}&calendar_diary_page=${calendarDiaryPage}`
    );

  const handleClickDiary = (id: number) => {
    router.push(`/calendar/${calendarId}/diary/${id}?date=${date}`);
  };

  const handleAddBtn = () =>
    router.push(`/calendar/${calendarId}/diary/create?date=${date}`);

  return (
    <div className={`${isCalendarDateModalOpen ? "block" : "hidden"} lg:block`}>
      <div className="flex justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-xl">공유 일기</h1>
          {contentType === StaticKeys.DIARY ? (
            <IconAdd
              onClick={handleAddBtn}
              className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px] cur transition-transform duration-200 transform hover:scale-110 animate-pulse"
            />
          ) : (
            <IconAdd
              onClick={handleAddBtn}
              className="w-[18px] h-[18px] lg:w-[20px] lg:h-[20px] cur"
            />
          )}
        </div>
        <div>
          <CalendarDiaryPagination total_count={diaryData?.total_count} />
        </div>
      </div>

      <div className="mt-[10px] bg_deep_2 h-[390px] w-[300px] lg:h-[480px] lg:w-[480px] rounded-md shadow_box bor overflow-hidden px-[12px] lg:px-[25px] noto-sans-text">
        {diaryData?.diaries?.length === 0 || !diaryData ? (
          <div className="flex h-full flex-col items-center">
            <p className="text-[#2D2D2E] text-lg">
              <span className="relative top-[100px] lg:top-[130px] right-[45px]">
                일기가...
              </span>
              <span className="relative top-[137px] lg:top-[167px] left-[45px]">
                없어...?
              </span>
            </p>
            <p></p>
            <IconEmptyDiary className="w-[150px] lg:w-[220px] h-[110px] lg:h-[161.21px] mt-[124px] lg:mt-[154px]" />
          </div>
        ) : (
          diaryData?.diaries?.map((diary: any, index: number) => {
            return (
              <div onClick={() => handleClickDiary(diary.id)} key={diary.id}>
                <div
                  className={`w-full h-[130px] lg:h-[160px] py-[10px] lg:py-[19px] text-lg flex justify-between cur ${
                    index != 2 ? "border-b border-[#49494950]" : ""
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <img
                        src={
                          diary.userProfile?.img == "" ||
                          diary.userProfile?.img == null
                            ? process.env.NEXT_PUBLIC_PROFILE_IMG
                            : diary.userProfile?.img
                        }
                        alt="profile"
                        className="w-[25px] h-[25px] rounded-full bor object-cover"
                      />
                      <p>{diary.userProfile?.name}</p>
                    </div>
                    <p
                      className={`font-light mt-[2px] text-[#2D2D2E] pb-[10px] lg:pb-[27px] ${
                        diary.img
                          ? "w-[150px] lg:w-[300px]"
                          : "w-[274px] lg:w-[430px]"
                      } border-b border-[#49494920]`}
                    >
                      {Helper.cutString(diary.title, diary.img ? 18 : 22)}
                    </p>
                    <div className="flex space-x-3 text-base mt-3">
                      <div className="flex items-center space-x-2">
                        <IconHeart className="w-[15px] h-[15px] lg:w-[20px] lg:h-[20px] cur" />
                        <div>{diary.likeCount}</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <IconComment className="w-[15px] h-[15px] lg:w-[20px] lg:h-[20px] cur" />
                        <div>{diary.commentCount}</div>
                      </div>
                    </div>
                  </div>
                  {
                    diary.img ? (
                      <img
                        src={diary.img}
                        alt="diary"
                        className="w-[100px] h-[100px] lg:w-[118px] lg:h-[118px] object-cover rounded-md bor"
                      />
                    ) : null
                    // <div className="w-[118px] h-[118px] rounded-md bor bg-[#D9D9D9]" />
                  }
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default DiaryList;
