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
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";

const getUser = async (accessToken: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getUserTodos = async (accessToken: any, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER_TODOS(query)}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

const getChatRooms = async (accessToken: any, query: string) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_CHAT_ROOMS(query)}`,
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
  const chatRoomPage = `chat_room_page=${
    req.searchParams.chat_room_page ?? "1"
  }`;
  const chatRoomSize = `chat_room_size=${
    req.searchParams.chat_room_size ?? "10"
  }`;
  const queries = `${chatRoomPage}&${chatRoomSize}`;

  Promise.all([
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => getUser(accessToken),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CHAT_ROOMS, queries],
      queryFn: () => getChatRooms(accessToken, queries),
    }),
    await queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, todoPage],
      queryFn: () => getUserTodos(accessToken, todoPage),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
