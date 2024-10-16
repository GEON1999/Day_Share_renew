import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
import QueryKeys from "@/keys/QueryKeys";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";
import ClientPage from "./clientPage";

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

const getTodoDetail = async (accessToken: any, id: string, todoId: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_TODO_DETAIL(id, todoId)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getComments = async (accessToken: any, id: string, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_COMMENTS(id, query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getLikes = async (accessToken: any, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_LIKES(query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getCalendarProfile = async (
  accessToken: any,
  id: string,
  userId: string
) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CALENDAR_PROFILE(id, userId)}`,
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

export default async function Home(req: any) {
  const encryptedAccessToken = cookies().get("AccessToken");
  const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

  const queryClient = new QueryClient();

  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  const id = req.params.id;
  const todoId = req.params.todoId;

  const query = `contentType=todo&contentId=${todoId}`;

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_TODOS, id, todoPage],
      queryFn: () => useGetTodosByCalendarId(accessToken, id, todoPage),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_TODO_DETAIL, id, todoId],
      queryFn: () => getTodoDetail(accessToken, id, todoId),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_COMMENTS, id, query],
      queryFn: () => getComments(accessToken, id, query),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_LIKES, query],
      queryFn: () => getLikes(accessToken, query),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id],
      queryFn: () => getCalendarPermissionList(accessToken, id),
    }),
  ]);

  const todoDetail = queryClient.getQueryData([
    QueryKeys.GET_TODO_DETAIL,
    id,
    todoId,
  ]);

  const userId = `userId=${todoDetail.userId}`;
  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PROFILE, id, userId],
    queryFn: () => getCalendarProfile(accessToken, id, userId),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
