import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import QueryKeys from "@/keys/QueryKeys";
import { useQuery } from "@tanstack/react-query";
// Create Calendar
const getChatRoom = async (queries: string) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.GET_CHAT_ROOM(queries)
  );
  return data;
};

const getChatMessages = async (chatId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CHAT_MESSAGES(chatId)
  );
  return data;
};

const useGetChatMessages = (chatId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CHAT_MESSAGES, chatId],
    queryFn: () => getChatMessages(chatId),
  });
};

const getChatRooms = async (queries: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CHAT_ROOMS(queries)
  );
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
};
