"use client";

import CalendarLayout from "@/components/calendar/CalendarLayout";
import ChatRoomPagination from "@/components/pagination/chatroomPagination";
import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconEmptyTodo } from "@/icons";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useRouter } from "next/navigation";
const ClientPage = () => {
  const router = useRouter();
  const calendarId = useSearch.useSearchId();
  const chatPage = useSearch.useSearchChatPage();
  const chatSize = useSearch.useSearchChatSize();
  const { data } = useCalendarQueries.useGetCalendarChatRooms(
    calendarId,
    `chat_room_page=${chatPage}&chat_room_size=${chatSize}`
  );

  console.log(data);

  const handleChatRoomClick = (chatRoom: any) => {
    router.push(`/calendar/${chatRoom.calendarId}/chat/${chatRoom.id}`);
  };

  return (
    <CalendarLayout>
      <div className="flex flex-col h-screen bg-[#FFFCF0] py-15 px-5 lg:p-[100px] justify-start items-center">
        <div className="flex flex-col w-full max-w-[800px]">
          {data.total_count === 0 ? (
            <div className="flex flex-col items-center">
              <IconEmptyTodo
                className={
                  "text-white h-[150px] lg:h-[205.98px] w-[120px] lg:w-[170px] mt-[10px]"
                }
              />
              <p className="mt-[7px]">채팅이 기록이 아직 없어요.</p>
            </div>
          ) : (
            data.chat_rooms.map((chatRoom: any, index: number) => {
              return (
                <div
                  key={chatRoom.chat_room.id}
                  className={`flex items-center border-b py-3 sm:py-4 px-2 cur`}
                  onClick={() => handleChatRoomClick(chatRoom.chat_room)}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                    <img
                      src={
                        chatRoom.user_info.img === "" ||
                        chatRoom.user_info.img === null
                          ? process.env.NEXT_PUBLIC_PROFILE_IMG
                          : chatRoom.user_info.img
                      }
                      alt="Profile"
                      className="w-[40px] h-[40px] sm:w-[50px] sm:h-[50px] rounded-full bor"
                    />
                    <div className="flex flex-col flex-1 overflow-hidden">
                      <div className="flex space-x-2 sm:space-x-3 items-center">
                        <div className="text-sm sm:text-base font-medium">
                          {chatRoom.user_info.name}
                        </div>
                        <div className="text-[10px] sm:text-xs text-[#49494950]">
                          {Helper.formatDateForComment(
                            chatRoom.last_message.created_at
                          )}
                        </div>
                      </div>
                      <div className="max-w-full text-sm truncate">
                        {chatRoom?.last_message?.content}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div className="flex justify-center mt-6 sm:mt-10">
            <ChatRoomPagination
              total_count={data.total_count}
              current_page={data.current_page}
              total_page={data.total_page}
            />
          </div>
        </div>
      </div>
    </CalendarLayout>
  );
};

export default ClientPage;
