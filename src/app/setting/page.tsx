import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";
import SettingClientPage from "@/app/setting/clientPage";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

const getUser = async (accessToken: any) => {
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

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();

  const todoPage = `todo_page=${req.searchParams.todo_page ?? "1"}`;

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER],
      queryFn: () => getUser(accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, todoPage],
      queryFn: () => getUserTodos(accessToken, todoPage),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SettingClientPage />
    </HydrationBoundary>
  );
}
