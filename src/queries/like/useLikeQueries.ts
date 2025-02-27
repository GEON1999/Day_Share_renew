// useLikeQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import rqOption from "@/server/rqOption";

// Get Likes Count
const getLikes = async (query: string, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_LIKES(query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetLikes = (query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_LIKES, query],
    queryFn: () => getLikes(query),
  });
};

export default {
  useGetLikes,
  getLikes,
};
