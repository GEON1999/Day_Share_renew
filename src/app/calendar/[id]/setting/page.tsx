import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";
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

const getCalendarBasic = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_BASIC(id)}`,
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

const getCalendarUserInfo = async (accessToken: any, id: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_USER_INFO(id)}`,
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

  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  const id = req.params.id;

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_TODOS, id, todoPage],
      queryFn: () => useGetTodosByCalendarId(accessToken, id, todoPage),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id],
      queryFn: () => getCalendarPermissionList(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, id],
      queryFn: () => getCalendarBasic(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_INVITE_CODE, id],
      queryFn: () => getInviteCode(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_USER_INFO, id],
      queryFn: () => getCalendarUserInfo(accessToken, id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
