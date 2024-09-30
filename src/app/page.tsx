import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
  useMutation,
} from "@tanstack/react-query";
import ClientPage from "./clientPage";
import QueryKeys from "@/keys/QueryKeys";
import API from "@/server/API";
import axios from "axios";
import rqOption from "@/server/rqOption";

const getUser = async (accessToken: any) => {
  const { data } = await axios.get(
    `${process.env.BASE_URL}${API.GET_USER}`,
    rqOption.apiHeader(accessToken)
  );
  return data;
};

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_USER],
    queryFn: () => getUser(process.env.TEST_ACCESS_TOKEN),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
