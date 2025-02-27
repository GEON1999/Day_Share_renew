import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import ClientPage from "./clientPage";
import QueryKeys from "@/keys/QueryKeys";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import useUserQueries from "@/queries/user/useUserQueries";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();

  const page = `page=${req.searchParams.page ?? "1"}`;
  const diaryPage = `diary_page=${req.searchParams.diary_page ?? "1"}`;
  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => useUserQueries.getUser(accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, todoPage],
      queryFn: () => useUserQueries.getUserTodos(todoPage, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_DIARIES, diaryPage],
      queryFn: () => useUserQueries.getUserDiaries(diaryPage, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_LIST, page],
      queryFn: () => useCalendarQueries.getCalendarList(page, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_FAVORITE_TODO],
      queryFn: () => useUserQueries.getUserFavoriteTodo(accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
