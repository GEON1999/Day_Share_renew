import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
import ClientPage from "./clientPage";
import QueryKeys from "@/keys/QueryKeys";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";
import Helper from "@/helper/Helper";

const getUser = async (accessToken: any) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getUserTodos = async (accessToken: any, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER_TODOS(query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getUserDiaries = async (accessToken: any, queries: any) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER_DIARIES(queries)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getCalendarList = async (accessToken: any, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_LIST(query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getUserFavoriteTodo = async (accessToken: any) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER_FAVORITE_TODO}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

export default async function Home(req: any) {
  const encryptedAccessToken = cookies().get("AccessToken");
  const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

  const queries = Helper.queryToString(req.searchParams) ?? "";
  const queryClient = new QueryClient();

  const page = `page=${req.searchParams.page ?? "1"}`;
  const diaryPage = `diary_page=${req.searchParams.diary_page ?? "1"}`;
  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => getUser(accessToken),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, todoPage],
      queryFn: () => getUserTodos(accessToken, todoPage),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_DIARIES, diaryPage],
      queryFn: () => getUserDiaries(accessToken, diaryPage),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_LIST, page],
      queryFn: () => getCalendarList(accessToken, page),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_FAVORITE_TODO],
      queryFn: () => getUserFavoriteTodo(accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
