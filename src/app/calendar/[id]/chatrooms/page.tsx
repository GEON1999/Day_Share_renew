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

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();
  const id = req.params.id;
  const userPage = `user_page=${req.searchParams.user_page ?? "1"}`;
  const chatPage = `chat_room_page=${req.searchParams.chat_room_page ?? "1"}`;
  const chatSize = `chat_room_size=${req.searchParams.chat_room_size ?? "10"}`;

  const queries = `${chatPage}&${chatSize}`;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id, userPage],
      queryFn: () =>
        useCalendarQueries.getCalendarPermissionList(id, userPage, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, id],
      queryFn: () => useCalendarQueries.getCalendarBasic(id, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_CHAT_ROOMS, id, queries],
      queryFn: () =>
        useCalendarQueries.getCalendarChatRooms(id, queries, accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
