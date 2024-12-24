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

const getCalendarPermissionList = async (
  accessToken: any,
  id: string,
  query: string
) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_PERMISSION_LIST(id, query)}`,
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

const getCalendarBasic = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_BASIC(id)}`,
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
  const date = `date=${req.searchParams.date ?? ""}`;
  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  const calendarTodoPage = `calendar_todo_page=${
    req.searchParams.calendar_todo_page ?? "1"
  }`;
  const todoQueries = `${date}&${calendarTodoPage}`;

  const diaryPage = `calendar_diary_page=${
    req.searchParams.calendar_diary_page ?? "1"
  }`;
  const userPage = `user_page=${req.searchParams.user_page ?? "1"}`;
  const diaryQueries = `${date}&${diaryPage}`;

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
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id, userPage],
      queryFn: () => getCalendarPermissionList(accessToken, id, userPage),
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
      queryKey: [QueryKeys.GET_TODOS, id, todoQueries],
      queryFn: () => getTodoDetail(accessToken, id, todoQueries),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_DIARIES, id, diaryQueries],
      queryFn: () => getDiaryDetail(accessToken, id, diaryQueries),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, id],
      queryFn: () => getCalendarBasic(accessToken, id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
