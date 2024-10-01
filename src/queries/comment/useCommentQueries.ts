// useCommentQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Comments
const getComments = async (calendarId: number, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_COMMENTS(calendarId, query)
  );
  return data;
};

const useGetComments = (calendarId: number, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_COMMENTS, calendarId, query],
    queryFn: () => getComments(calendarId, query),
  });
};

export default {
  useGetComments,
};
