import { dodum } from "@/app/fonts";
import DiaryPagination from "@/components/pagination/diaryPagination";
import useSearch from "@/hooks/useSearch";
import useUserQueries from "@/queries/user/useUserQueries";
import { useRouter } from "next/navigation";

const DiarySection = () => {
  const router = useRouter();
  const currentDiaryPage = useSearch.useSearchDiaryPage();

  const { data: diaryData } = useUserQueries.useGetUserDiaries(
    `diary_page=${currentDiaryPage}`
  );

  const handleClickDiary = (calId: number, diaryId: number) => {
    router.push(`/calendar/${calId}/diary/${diaryId}`);
  };

  return (
    <section className="">
      <div className="flex justify-between">
        <h2 className={`dashboard_title ${dodum.className}`}>공유 일기</h2>
        <DiaryPagination total_count={diaryData?.total_count} />
      </div>
      {diaryData ? (
        <ul className="bg-[#F9F4CF] px-[10px] bor rounded-md w-[950px] h-[270px] shadow_box">
          {diaryData?.diaries?.map((diary: any, idx: number) => (
            <li
              onClick={() => {
                handleClickDiary(diary.calendarId, diary.id);
              }}
              key={diary.id}
              className={`px-[6px] bg-transparent items-center flex justify-between h-[67.5px] text-[23px] cur ${
                idx === 3
                  ? "border-b-[0px]"
                  : "border-b-[1.5px] border-[#494949]"
              }`}
            >
              <span>{diary.title}</span>
              <span className="text-sm text-gray-500">박건</span>
            </li>
          ))}
        </ul>
      ) : (
        <div>
          <img
            className="bor rounded-md bg-[#F9F4CF] shadow_box "
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024150301_23db0106b82f4323b8f03cef66282fe7.png"
          />
          <p
            className={`text-center text-[30px] ${dodum.className} absolute top-[502px] left-[1300px]`}
          >
            일기가 없어......................
          </p>
        </div>
      )}
    </section>
  );
};

export default DiarySection;
