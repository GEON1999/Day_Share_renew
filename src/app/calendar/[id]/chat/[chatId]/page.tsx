import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import ClientPage from "./clientPage";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useUserQueries from "@/queries/user/useUserQueries";
import useChatQueries from "@/queries/chat/useChatQueries";

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();
  const calendarId = req.params.id;
  const id = req.params.chatId;
  const userPage = `user_page=${req.searchParams.user_page ?? "1"}`;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CHAT_MESSAGES, id],
      queryFn: () => useChatQueries.getChatMessages(id, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => useUserQueries.getUser(accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, calendarId, userPage],
      queryFn: () =>
        useCalendarQueries.getCalendarPermissionList(
          calendarId,
          userPage,
          accessToken
        ),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, calendarId],
      queryFn: () =>
        useCalendarQueries.getCalendarBasic(calendarId, accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
