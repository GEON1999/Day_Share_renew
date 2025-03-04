import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import QueryKeys from "@/keys/QueryKeys";
import { useQuery } from "@tanstack/react-query";
import rqOption from "@/server/rqOption";

// Create Chat Room
const getChatRoom = async (queries: string) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.GET_CHAT_ROOM(queries)
  );
  return data;
};

const getChatMessages = async (
  chatId: string,
  calendarId: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_CHAT_MESSAGES(chatId, calendarId);
  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.get(url, config);
  return data;
};

const useGetChatMessages = (chatId: string, calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CHAT_MESSAGES, chatId, calendarId],
    queryFn: () => getChatMessages(chatId, calendarId),
  });
};

const getChatRooms = async (queries: string, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_CHAT_ROOMS(queries);
  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.get(url, config);
  return data;
};

const useGetChatRooms = (queries: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CHAT_ROOMS, queries],
    queryFn: () => getChatRooms(queries),
  });
};

export default {
  getChatRoom,
  useGetChatMessages,
  useGetChatRooms,
  getChatRooms,
  getChatMessages,
};
