// useDiaryQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import rqOption from "@/server/rqOption";

// Get Diaries by Date
const getDiaries = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_DIARIES(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetDiaries = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_DIARIES, calendarId, query],
    queryFn: () => getDiaries(calendarId, query),
  });
};

// Get Diary Detail
const getDiaryDetail = async (
  calendarId: string,
  diaryId: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_DIARY_DETAIL(calendarId, diaryId);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetDiaryDetail = (calendarId: string, diaryId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_DIARY_DETAIL, calendarId, diaryId],
    queryFn: () => getDiaryDetail(calendarId, diaryId),
  });
};

export default {
  useGetDiaries,
  useGetDiaryDetail,
  getDiaries,
  getDiaryDetail,
};
