import CalendarDiaryPagination from "@/components/pagination/calendarDiaryPagination";
import Helper from "@/helper/Helper";
import { IconEmptyDiary, IconEmptyTodo } from "@/icons";
import useSearch from "@/hooks/useSearch";
import { IconAdd } from "@/icons";
import StaticKeys from "@/keys/StaticKeys";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useRouter } from "next/navigation";
import { IconHeart, IconComment } from "@/icons";
import DiaryPagination from "@/components/pagination/diaryPagination";
import TodoPagination from "@/components/pagination/todoPagination";

const CalendarUserProfile = () => {
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
  console.log("calendarUser :", calendarUser);

  const user = calendarUser?.user_profile;
  const todos = calendarUser?.todos;
  const diaries = calendarUser?.diaries;

  const handleClickDiary = (id: number) => {
    router.push(`/calendar/${calendarId}/diary/${id}?date=${date}`);
  };

  const handleAddBtn = () =>
    router.push(`/calendar/${calendarId}/diary/create?date=${date}`);

  return (
    <div className="main_container py-[30px]">
      <h1 className="justify-center items-center flex text-[40px] mt-10">
        <span className=" bg_hilight px-1">{user?.name}</span> &nbsp;님의 프로필
      </h1>
      <div className="flex justify-between mt-20">
        <div className="flex flex-col  space-y-[157px]">
          {/* 유저 프로필 */}
          <section className="flex justify-between space-x-20">
            <div className="flex flex-col items-center space-y-4">
              <img
                src={
                  user?.img === "" || user?.img === null
                    ? process.env.NEXT_PUBLIC_CALENDAR_IMG
                    : user?.img
                }
                alt="user"
                className="w-[200px] h-[200px] object-cover rounded-full bor shadow_box"
              />
              <button className="btn_hilight w-[200px] h-[37px] rounded-md bor">
                채팅하기
              </button>
            </div>
            <div className="flex flex-col items-center space-y-5 text-[20px] w-[300px] mt-[30px]">
              <div className="flex items-center justify-between w-full">
                <p>이름 :</p>
                <p className="">{user?.name}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p>가입일 :</p>
                <p className="">{Helper.formatDate(user?.createdAt)}</p>
              </div>
              <div className="flex items-center justify-between w-full">
                <p>총 게시물 :</p>
                <p className="">
                  {calendarUser?.total_diaries + calendarUser?.total_todos} 개
                </p>
              </div>
            </div>
          </section>

          {/* 공유 일정 */}
          <section className="w-[580px]">
            <div className="relative">
              <div className="flex justify-between">
                <div className="flex items-center space-x-3">
                  <h1 className="text-2xl">
                    {calendarUser?.user_profile?.name}님의 일정
                  </h1>
                </div>
                <div>
                  <TodoPagination total_count={calendarUser?.total_todos} />
                </div>
              </div>
              <div className="flex-grow overflow-hidden px-[25px] bor w-[580px] h-[220px] mt-[10px] rounded-md bg_deep_2 py-[10px] shadow_box">
                {calendarUser?.todos?.length === 0 || !calendarUser?.todos ? (
                  <div className="flex justify-between items-center h-full px-[13px]">
                    <p className="text-[#2D2D2E] text-[20px]">
                      일정이 없어요. 추가해 볼까요?
                    </p>
                    <IconEmptyTodo className="w-[134px] h-[162.36px] mt-12" />
                  </div>
                ) : (
                  calendarUser?.todos?.map((todo: any, index: number) => {
                    return (
                      <div
                        key={todo.id}
                        className={`h-[50px] cur flex justify-between items-center py-[10px] text-[20px] ${
                          index != 3 ? "border-b border-[#49494950]" : ""
                        }`}
                      >
                        <div
                          className={`flex items-center space-x-[15px] w-[350px] overflow-hidden whitespace-nowrap`}
                        >
                          <div>{Helper.formatTimeForTodo(todo.startAt)}</div>
                          <div>{Helper.cutString(todo.title, 18)}</div>
                        </div>
                        <div className="flex items-center space-x-[15px] ">
                          <div className="w-[100px] text-right">
                            {calendarUser?.user_profile?.name}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </section>
        </div>
        {/* 공유 일기 */}
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
              {diaries?.length === 0 || !diaries ? (
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
                diaries?.map((diary: any, index: number) => {
                  return (
                    <div
                      onClick={() => handleClickDiary(diary.id)}
                      key={diary.id}
                    >
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
                          <div className="flex space-x-3 text-[15px] mt-3">
                            <div className="flex items-center space-x-2">
                              <IconHeart className="w-5 h-5 cur" />
                              <div>{diary.likeCount}</div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <IconComment className="w-5 h-5 cur" />
                              <div>{diary.commentCount}</div>
                            </div>
                          </div>
                        </div>
                        {
                          diary.img ? (
                            <img
                              src={diary.img}
                              alt="diary"
                              className="w-[118px] h-[118px] object-cover rounded-md bor"
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
        </section>
      </div>
    </div>
  );
};

export default CalendarUserProfile;
