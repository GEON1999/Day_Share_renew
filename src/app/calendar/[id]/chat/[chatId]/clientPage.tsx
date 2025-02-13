"use client";

import React, { useEffect, useState, useRef } from "react";
import useSearch from "@/hooks/useSearch";
import useChatQueries from "@/queries/chat/useChatQueries";
import useUserQueries from "@/queries/user/useUserQueries";
import Helper from "@/helper/Helper";
import CalendarLayout from "@/components/calendar/CalendarLayout";

type ChatMessage = {
  sender: string;
  content: string;
  created_at?: string;
  name?: string;
  img?: string;
};

export default function ChatPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isComposing, setIsComposing] = useState(false);
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatRoomId = useSearch.useSearchChatId();
  const calendarId = useSearch.useSearchId();

  const { data: user } = useUserQueries.useGetUser();

  const { data: chatMessages, isLoading: isChatMessagesLoading } =
    useChatQueries.useGetChatMessages(chatRoomId);

  useEffect(() => {
    if (chatMessages) {
      setMessages(chatMessages);
      setTimeout(() => {
        messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [chatMessages]);

  // 새 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(
      `${process.env.NEXT_PUBLIC_WS_URL}?chat_room_id=${chatRoomId}`
    );
    wsRef.current = ws;

    ws.onopen = () => {
      setIsLoading(false);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
      } catch (error) {
        console.error("메시지 처리 에러:", error);
      }
    };

    ws.onclose = () => {
      console.log("웹소켓 연결 종료");
    };

    ws.onerror = (error) => {
      console.error("웹소켓 에러:", error);
    };

    return () => {
      ws.close();
    };
  }, [chatRoomId]);

  const sendMessage = () => {
    console.log(input);
    if (!input.trim()) return;

    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      const messagePayload = {
        sender: user.id,
        content: input,
        created_at: new Date().toISOString(),
      };
      wsRef.current.send(JSON.stringify(messagePayload));
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <CalendarLayout>
      <div className="flex flex-col h-screen bg-[#FFFCF0] px-[6px]">
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="loading spinner " />
          ) : (
            <>
              {messages.map((msg, index) => {
                const isMyMessage = msg.sender == user.id;
                const showTime = true;
                const dateString = Helper.formatDateForChat(
                  msg.created_at ?? ""
                );
                const prevMessage = index > 0 ? messages[index - 1] : null;

                const currentDate = new Date(
                  new Date(msg.created_at ?? "").getTime() + 9 * 60 * 60 * 1000
                );
                const prevDate = prevMessage
                  ? new Date(
                      new Date(prevMessage.created_at ?? "").getTime() +
                        9 * 60 * 60 * 1000
                    )
                  : null;

                // 날짜가 바뀌었는지 확인
                const showDateHeader =
                  !prevDate ||
                  currentDate.getFullYear() !== prevDate.getFullYear() ||
                  currentDate.getMonth() !== prevDate.getMonth() ||
                  currentDate.getDate() !== prevDate.getDate();

                return (
                  <>
                    {showDateHeader && (
                      <div className="flex justify-center my-4">
                        <div className="bg-[#49494930] text-[#494949] text-xs px-3 py-1 my-[10px] rounded-full">
                          {currentDate.getFullYear()}년{" "}
                          {currentDate.getMonth() + 1}월 {currentDate.getDate()}
                          일
                        </div>
                      </div>
                    )}
                    <div
                      key={index}
                      className={`flex items-center mb-4 ${
                        isMyMessage ? "justify-end" : "justify-start"
                      }`}
                    >
                      {!isMyMessage && (
                        <div className="flex-shrink-0 mr-2">
                          <img
                            src={
                              msg.img === "" || msg.img === null
                                ? process.env.NEXT_PUBLIC_PROFILE_IMG
                                : msg.img
                            }
                            alt="Profile"
                            className="rounded-full w-[35px] h-[35px]"
                          />
                        </div>
                      )}
                      <div
                        className={`flex flex-col ${
                          isMyMessage ? "items-end" : "items-start"
                        }`}
                      >
                        {!isMyMessage && (
                          <span className="text-sm text-gray-300 mb-[2px]">
                            {msg.name}
                          </span>
                        )}
                        <div className="flex items-end gap-2">
                          {isMyMessage && showTime && (
                            <span className="text-xs text-gray-400 mb-1">
                              {dateString}
                            </span>
                          )}
                          <div
                            className={`rounded-2xl px-4 py-2 break-words text-[#494949] max-w-[50vw] whitespace-pre-wrap ${
                              isMyMessage ? "bg-[#F6BEBE]" : "bg-[#F8F3CE]"
                            }`}
                          >
                            {msg.content}
                          </div>
                          {!isMyMessage && showTime && (
                            <span className="text-xs text-gray-400 mb-1">
                              {dateString}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}
          <div ref={messageEndRef} />
        </div>

        <div className="px-4 pb-4">
          <div className="bor w-full h-[162px] rounded pt-[15px] bg-white flex flex-col space-y-[10px] justify-between">
            <div>
              <div className="pr-1">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onCompositionStart={() => setIsComposing(true)}
                  onCompositionEnd={() => setIsComposing(false)}
                  placeholder="메시지를 입력하세요..."
                  className="w-full px-[18px] h-[64px] mt-[5px] outline-none rounded bg-transparent text-[15px] placeholder:opacity-50 focus:outline-none resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end space-x-[4px] h-[37px] border-t px-[10px]">
              <button
                onClick={sendMessage}
                className="w-[40px] bor h-[25px] rounded ml-auto btn_while"
              >
                전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </CalendarLayout>
  );
}
