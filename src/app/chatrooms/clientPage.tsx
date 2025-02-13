"use client";

import React from "react";
import useSearch from "@/hooks/useSearch";
import useChatQueries from "@/queries/chat/useChatQueries";
import Helper from "@/helper/Helper";
import MainLayout from "@/components/main/MainLayout";
import { useRouter } from "next/navigation";
import ChatRoomPagination from "@/components/pagination/chatroomPagination";

const ChatPage = () => {
  const router = useRouter();
  const chatPage = useSearch.useSearchChatPage();
  const chatSize = useSearch.useSearchChatSize();
  const { data: chatRooms } = useChatQueries.useGetChatRooms(
    `chat_room_page=${chatPage}&chat_room_size=${chatSize}`
  );

  const handleChatRoomClick = (chatRoom: any) => {
    router.push(`/calendar/${chatRoom.calendarId}/chat/${chatRoom.id}`);
  };

  return (
    <MainLayout>
      <div className="flex flex-col h-screen bg-[#FFFCF0] p-[100px] justify-start items-center">
        <div className="flex flex-col w-[800px] ">
          {chatRooms.map((chatRoom: any, index: number) => {
            return (
              <div
                key={chatRoom.chat_room.id}
                className={`flex items-center border-b py-4 px-2 cur`}
                onClick={() => handleChatRoomClick(chatRoom.chat_room)}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      chatRoom.user_info.img === "" ||
                      chatRoom.user_info.img === null
                        ? process.env.NEXT_PUBLIC_PROFILE_IMG
                        : chatRoom.user_info.img
                    }
                    alt="Profile"
                    className="w-[50px] h-[50px] rounded-full bor"
                  />
                  <div className="flex flex-col">
                    <div className="flex space-x-3 items-center">
                      <div>{chatRoom.user_info.name}</div>
                      <div className="text-xs text-[#49494950]">
                        {Helper.formatDateForComment(
                          chatRoom.chat_room.updated_at
                        )}
                      </div>
                    </div>
                    <div className="max-w-[400px] truncate">
                      {chatRoom.last_message.content}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
          <div className="flex justify-center mt-10">
            <ChatRoomPagination total_count={chatRooms.length} />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ChatPage;
