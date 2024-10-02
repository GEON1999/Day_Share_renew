// useUserQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get User Info
const getUser = async (req: any) => {
  const { data } = await axios.get(Helper.CURRENT_URL() + API.GET_USER);
  return data;
};

const useGetUser = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER],
    queryFn: getUser,
  });
};

// Get User Todos
const getUserTodos = async (query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_USER_TODOS(query)
  );
  return data;
};

const useGetUserTodos = (query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_TODOS, query],
    queryFn: () => getUserTodos(query),
  });
};

// Get User Diaries
const getUserDiaries = async (query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_USER_DIARIES(query)
  );
  return data;
};

const useGetUserDiaries = (query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_DIARIES, query],
    queryFn: () => getUserDiaries(query),
  });
};

export default {
  useGetUser,
  useGetUserTodos,
  useGetUserDiaries,
  getUser,
  getUserTodos,
  getUserDiaries,
};
