// useLikeQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Likes Count
const getLikes = async (contentId: number, contentType: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_LIKES(contentId, contentType)
  );
  return data;
};

const useGetLikes = (contentId: number, contentType: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_LIKES, contentId, contentType],
    queryFn: () => getLikes(contentId, contentType),
  });
};

export default {
  useGetLikes,
};
