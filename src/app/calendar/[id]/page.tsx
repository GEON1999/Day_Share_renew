import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import Helper from "@/helper/Helper";
import ClientPage from "./clientPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import axios from "axios";
import { getKoreanHolidays } from "@/utils/holidayUtils";

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queries = Helper.queryToString(req.searchParams) ?? "";

  const queryClient = new QueryClient();
  const date = `date=${req.searchParams.date ?? ""}`;
  const timestamp = `timestamp_ms=${req.searchParams.date ?? ""}`;
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
  const calendarId = encodeURIComponent(
    "ko.south_korea#holiday@group.v.calendar.google.com"
  );

  const currentYear = new Date().getFullYear();

  const holidays = await getKoreanHolidays(currentYear);

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_TODOS, id, todoPage],
      queryFn: () =>
        useTodoQueries.getTodosByCalendarId(id, todoPage, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_LIST, queries],
      queryFn: () => useCalendarQueries.getCalendarList(queries, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id, userPage],
      queryFn: () =>
        useCalendarQueries.getCalendarPermissionList(id, userPage, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_DATES, id, timestamp],
      queryFn: () =>
        useCalendarQueries.getCalendarDates(id, timestamp, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_TODOS, id, todoQueries],
      queryFn: () => useTodoQueries.getTodos(id, todoQueries, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_DIARIES, id, diaryQueries],
      queryFn: () => useDiaryQueries.getDiaries(id, diaryQueries, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, id],
      queryFn: () => useCalendarQueries.getCalendarBasic(id, accessToken),
    }),
    // 공휴일 정보 프리패칭 추가
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_HOLIDAYS, currentYear],
      queryFn: () => Promise.resolve(holidays),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
