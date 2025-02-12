"use client";

import React, { useEffect, useState, useRef } from "react";
import useSearch from "@/hooks/useSearch";
import useChatQueries from "@/queries/chat/useChatQueries";
import useUserQueries from "@/queries/user/useUserQueries";

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
  const [input, setInput] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);
  const chatRoomId = useSearch.useSearchChatId();

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

    ws.onmessage = async (event) => {
      try {
        const data = JSON.parse(event.data);
        await setMessages((prev) => [...prev, data]);
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

  const formatTime = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex flex-col h-screen bg-[#191919]">
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="loading spinner " />
        ) : (
          <>
            {messages.map((msg, index) => {
              const isMyMessage = msg.sender == user.id;
              const showTime = true;

              return (
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
                          {formatTime(msg.created_at)}
                        </span>
                      )}
                      <div
                        className={`rounded-2xl px-4 py-2 max-w-[70%] break-words ${
                          isMyMessage
                            ? "bg-[#FEE500] text-black"
                            : "bg-[#333333] text-white"
                        }`}
                      >
                        {msg.content}
                      </div>
                      {!isMyMessage && showTime && (
                        <span className="text-xs text-gray-400 mb-1">
                          {formatTime(msg.created_at)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </>
        )}
        <div ref={messageEndRef} />
      </div>

      <div className="bg-[#222222] p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="메시지를 입력하세요..."
            className="flex-1 bg-[#333333] text-white rounded-full px-4 py-2 outline-none"
          />
          <button
            onClick={sendMessage}
            className="bg-[#FEE500] text-black px-6 rounded-full font-medium"
          >
            전송
          </button>
        </div>
      </div>
    </div>
  );
}
