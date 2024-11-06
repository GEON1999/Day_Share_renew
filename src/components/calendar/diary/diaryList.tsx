import useSearch from "@/hooks/useSearch";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import parse from "html-react-parser";
import { useRouter } from "next/navigation";

const DiaryList = () => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const date = useSearch.useSearchDate();

  const { data: diaryData, isLoading: diaryIsLoading } =
    useDiaryQueries.useGetDiaries(calendarId, `date=${date}`);

  const options = {
    replace: (node: any) => {
      if (node.type === "tag" && node.name === "img") {
        return (
          <img
            {...node.attribs}
            className="max-w-[500px] max-h-[300px] rounded-lg"
          />
        );
      }
    },
  };

  const handleClickDiary = (id: number) => {
    router.push(`/calendar/${calendarId}/diary/${id}?date=${date}`);
  };

  return (
    <div className="small_container shadow_box">
      <div className="h-[60px] bg_hilight flex items-center justify-center flex-shrink-0">
        <h1 className=" text-2xl">공유 일기</h1>
      </div>

      <div className="overflow-y-auto space-y-3 px-2">
        {diaryData?.length === 0 || !diaryData ? (
          <p className="p-5">일기가 없습니다</p>
        ) : (
          diaryData?.map((diary: any, index: number) => {
            return (
              <div
                onClick={() => handleClickDiary(diary.id)}
                key={diary.id}
                className={`${
                  index === 0 ? "" : "border-t"
                } cur flex justify-between items-center p-5  `}
              >
                <div className="">
                  <div className="flex items-center space-x-2">
                    <img
                      src={diary.userProfile?.img}
                      alt="profile"
                      className="w-12 h-12 rounded-full bor"
                    />
                    <div className="flex flex-col">
                      <p className="text-lg">{diary.title}</p>
                      <p className="gray text-sm">{diary.userProfile?.name}</p>
                    </div>
                  </div>
                  <div className="my-4"> {parse(diary.content, options)} </div>
                  <div className="flex space-x-3">
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-5 h-5"
                        src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076426211.png"
                      />
                      <div>{diary.likeCount}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <img
                        className="w-5 h-5"
                        src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076565076.png"
                      />
                      <div>{diary.commentCount}</div>
                    </div>
                  </div>
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
