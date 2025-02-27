// useCommentQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import rqOption from "@/server/rqOption";

// Get Comments
const getComments = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_COMMENTS(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetComments = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_COMMENTS, calendarId, query],
    queryFn: () => getComments(calendarId, query),
  });
};

export default {
  useGetComments,
  getComments,
};
