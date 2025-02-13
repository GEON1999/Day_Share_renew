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
import Helper from "@/helper/Helper";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";

const getChatMessages = async (chatId: string, accessToken: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CHAT_MESSAGES(chatId)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getUser = async (accessToken: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER}`,
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

  const queryClient = new QueryClient();
  const calendarId = req.params.id;
  const id = req.params.chatId;
  const userPage = `user_page=${req.searchParams.user_page ?? "1"}`;

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CHAT_MESSAGES, id],
      queryFn: () => getChatMessages(id, accessToken),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => getUser(accessToken),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, calendarId, userPage],
      queryFn: () =>
        getCalendarPermissionList(accessToken, calendarId, userPage),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, calendarId],
      queryFn: () => getCalendarBasic(accessToken, calendarId),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
