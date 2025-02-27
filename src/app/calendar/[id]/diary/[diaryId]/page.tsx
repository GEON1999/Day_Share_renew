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
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeQueries from "@/queries/like/useLikeQueries";

export default async function Home(req: any) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken;

  if (!accessToken && !session?.user?.isAuto) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();
  const userPage = `user_page=${req.searchParams.user_page ?? "1"}`;
  const id = req.params.id;
  const diaryId = req.params.diaryId;
  const query = `contentType=diary&contentId=${diaryId}`;

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_DIARY_DETAIL, id, diaryId],
    queryFn: () => useDiaryQueries.getDiaryDetail(id, diaryId, accessToken),
  });

  const diaryDetail = queryClient.getQueryData([
    QueryKeys.GET_DIARY_DETAIL,
    id,
    diaryId,
  ]);

  const userId = `userId=${diaryDetail?.userId ?? 0}`;
  queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PROFILE, id, userId],
    queryFn: () =>
      useCalendarQueries.getCalendarProfile(id, userId, accessToken),
  });
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, id, userPage],
      queryFn: () =>
        useCalendarQueries.getCalendarPermissionList(id, userPage, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_COMMENTS, id, query],
      queryFn: () => useCommentQueries.getComments(id, query, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_LIKES, query],
      queryFn: () => useLikeQueries.getLikes(query, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_BASIC, id],
      queryFn: () => useCalendarQueries.getCalendarBasic(id, accessToken),
    }),
    queryClient.prefetchQuery({
      queryKey: [QueryKeys.GET_CALENDAR_USER_INFO, id],
      queryFn: () => useCalendarQueries.getCalendarUserInfo(id, accessToken),
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
