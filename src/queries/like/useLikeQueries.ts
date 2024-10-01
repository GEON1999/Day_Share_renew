// useLikeQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Likes Count
const getLikes = async (query: string) => {
  const { data } = await axios.get(Helper.CURRENT_URL() + API.GET_LIKES(query));
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
};
