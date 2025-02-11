import DiaryPagination from "@/components/pagination/diaryPagination";
import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconAdd } from "@/icons";
import ModalType from "@/keys/ModalType";
import useUserQueries from "@/queries/user/useUserQueries";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ModalContainer from "@/components/modal/ModalContainer";
import StaticKeys from "@/keys/StaticKeys";

const DiarySection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const currentDiaryPage = useSearch.useSearchDiaryPage();

  const { data: diaryData } = useUserQueries.useGetUserDiaries(
    `diary_page=${currentDiaryPage}`
  );

  const handleClickDiary = (calId: number, diaryId: number) => {
    router.push(`/calendar/${calId}/diary/${diaryId}`);
  };

  const handleAddBtn = () => {
    setIsOpen(true);
  };

  return (
    <section className="">
      <div className="flex justify-between">
        <div className="flex items-center space-x-2">
          <h2 className={`dashboard_title`}>공유 일기</h2>
          <IconAdd onClick={handleAddBtn} className="w-5 h-5 cur mb-[10px]" />
        </div>
        <DiaryPagination total_count={diaryData?.total_count} />
      </div>
      {diaryData?.diaries && diaryData.diaries.length > 0 ? (
        <ul className="bg-[#F9F4CF] px-[10px] bor rounded-md w-[950px] h-[270px] shadow_box noto-serif-text">
          {diaryData?.diaries?.map((diary: any, idx: number) => {
            return (
              <li
                onClick={() => {
                  handleClickDiary(diary.calendarId, diary.id);
                }}
                key={diary.id}
                className={`px-[6px] bg-transparent items-center flex justify-between h-[67.5px] text-[23px] cur ${
                  idx === 3 ? "border-b-[0px]" : "border-b-[1.5px] "
                }`}
              >
                <div className="flex space-x-2 items-center">
                  <span className="text-[20px]">
                    {Helper.cutString(diary.title, 30)}
                  </span>
                  {Helper.isDateOlderThanOneDay(diary.createdAt) ? null : (
                    <img
                      className="h-[23.6px] w-[23.6px]"
                      src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241029163920_430d6b2ba39e4a05819e9c943b8b3461.png"
                      alt="new"
                    />
                  )}
                </div>
                <div className="text-[20px] text-[#2D2D2E] text-opacity-80 flex space-x-1 items-center justify-center">
                  <span>{diary.userName}</span>
                  <span className="mb-[5px] text-[15px]">|</span>
                  <span className="font-[500]">{diary.calendarName}</span>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="relative">
          <img
            className="bor rounded-md bg-[#F9F4CF] shadow_box "
            src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024150301_23db0106b82f4323b8f03cef66282fe7.png"
          />
          <p
            className={`text-center text-[25px] absolute top-[116px] left-[505px]`}
          >
            일기가 없어......................
          </p>
        </div>
      )}
      {isOpen && (
        <ModalContainer
          setIsOpen={setIsOpen}
          initialModal={ModalType.CREATE_CONTENT_HOME}
          contentType={StaticKeys.DIARY}
        />
      )}
    </section>
  );
};

export default DiarySection;
