import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import ChangePasswordClientPage from "./clientPage";
import useUserQueries from "@/queries/user/useUserQueries";

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
      queryFn: () => useUserQueries.getUser(accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_USER_TODOS, todoPage],
      queryFn: () => useUserQueries.getUserTodos(todoPage, accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ChangePasswordClientPage />
    </HydrationBoundary>
  );
}
