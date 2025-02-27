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
import useUserQueries from "@/queries/user/useUserQueries";
import useChatQueries from "@/queries/chat/useChatQueries";

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

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => useUserQueries.getUser(accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CHAT_ROOMS, queries],
      queryFn: () => useChatQueries.getChatRooms(queries, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, todoPage],
      queryFn: () => useUserQueries.getUserTodos(todoPage, accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
