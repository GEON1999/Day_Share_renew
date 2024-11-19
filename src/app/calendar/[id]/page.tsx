import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";
import Helper from "@/helper/Helper";
import ClientPage from "./clientPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const useGetTodosByCalendarId = async (
  accessToken: any,
  id: string,
  query: string
) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_TODOS(id, query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getCalendarPermissionList = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_PERMISSION_LIST(id)}`,
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

const getInviteCode = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_INVITE_CODE(id)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getCalendarDetail = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_DETAIL(id)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getCalendarDates = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_DATES(id)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getTodoDetail = async (accessToken: any, id: string, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_TODOS(id, query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getDiaryDetail = async (accessToken: any, id: string, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_DIARIES(id, query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queries = Helper.queryToString(req.searchParams) ?? "";

  const queryClient = new QueryClient();
  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  const id = req.params.id;

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_TODOS, id, todoPage],
      queryFn: () => useGetTodosByCalendarId(accessToken, id, todoPage),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_LIST, queries],
      queryFn: () => getCalendarList(accessToken, queries),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id],
      queryFn: () => getCalendarPermissionList(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_INVITE_CODE, id],
      queryFn: () => getInviteCode(accessToken, id),
    }),
    // await queryClient.prefetchQuery({
    //   queryKey: [QueryKeys.GET_CALENDAR_DETAIL, id],
    //   queryFn: () => getCalendarDetail(accessToken, id),
    // }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_DATES, id],
      queryFn: () => getCalendarDates(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_TODOS, id, queries],
      queryFn: () => getTodoDetail(accessToken, id, queries),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_DIARIES, id, queries],
      queryFn: () => getDiaryDetail(accessToken, id, queries),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
