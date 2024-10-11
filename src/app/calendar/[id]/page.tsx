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
import Helper from "@/helper/Helper";
import ClientPage from "./clientPage";

const getUserTodos = async (accessToken: any, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER_TODOS(query)}`,
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

export default async function Home(req: any) {
  const encryptedAccessToken = cookies().get("AccessToken");
  const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

  const queries = Helper.queryToString(req.searchParams) ?? "";

  const queryClient = new QueryClient();

  const id = req.params.id;
  console.log("id", id);

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, "page=1"],
      queryFn: () => getUserTodos(accessToken, "page=1"),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_LIST, queries],
      queryFn: () => getCalendarList(accessToken, queries),
    }),
    // await queryClient.prefetchQuery({
    //   queryKey: [QueryKeys.GET_CALENDAR_USER_INFO, id],
    //   queryFn: () => getCalendarUserInfo(accessToken, id),
    // }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id],
      queryFn: () => getCalendarPermissionList(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_INVITE_CODE, id],
      queryFn: () => getInviteCode(accessToken, id),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_DETAIL, id],
      queryFn: () => getCalendarDetail(accessToken, id),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
