// useCommentQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Comments
const getComments = async (
  calendarId: number,
  contentId: number,
  contentType: string
) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_COMMENTS(calendarId, contentId, contentType)
  );
  return data;
};

const useGetComments = (
  calendarId: number,
  contentId: number,
  contentType: string
) => {
  return useQuery({
    queryKey: [QueryKeys.GET_COMMENTS, calendarId, contentId, contentType],
    queryFn: () => getComments(calendarId, contentId, contentType),
  });
};

export default {
  useGetComments,
};
