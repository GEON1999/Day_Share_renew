// useUserQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import rqOption from "@/server/rqOption";

// Get User Info
const getUser = async (accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_USER;
  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.get(url, config);
  return data;
};
const useGetUser = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER],
    queryFn: getUser,
  });
};

// Get User Todos
const getUserTodos = async (query: string, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_USER_TODOS(query);
  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.get(url, config);
  return data;
};
const useGetUserTodos = (query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_TODOS, query],
    queryFn: () => getUserTodos(query),
  });
};

// Get User Diaries
const getUserDiaries = async (query: any, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_USER_DIARIES(query);
  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.get(url, config);
  return data;
};
const useGetUserDiaries = (query: any) => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_DIARIES, query],
    queryFn: () => getUserDiaries(query),
  });
};

// Get User favorite todos
const getUserFavoriteTodo = async (accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_USER_FAVORITE_TODO;
  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };
  const { data } = await axios.get(url, config);
  return data;
};
const useGetUserFavoriteTodo = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_FAVORITE_TODO],
    queryFn: getUserFavoriteTodo,
  });
};

export default {
  useGetUser,
  useGetUserTodos,
  useGetUserDiaries,
  getUser,
  getUserTodos,
  getUserDiaries,
  useGetUserFavoriteTodo,
  getUserFavoriteTodo,
};
