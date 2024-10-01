import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { cookies } from "next/headers";
import AesEncryption from "@/utils/AesEncryption";
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
  const encryptedAccessToken = cookies().get("AccessToken");
  const accessToken = AesEncryption.aes_decrypt(encryptedAccessToken);

  console.log("accessToken", accessToken);
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: [QueryKeys.GET_USER],
    queryFn: () => getUser(accessToken),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ClientPage />
    </HydrationBoundary>
  );
}
