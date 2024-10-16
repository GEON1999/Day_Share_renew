// useDiaryQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Diaries by Date
const getDiaries = async (calendarId: string, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_DIARIES(calendarId, query)
  );
  return data;
};

const useGetDiaries = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_DIARIES, calendarId, query],
    queryFn: () => getDiaries(calendarId, query),
  });
};

// Get Diary Detail
const getDiaryDetail = async (calendarId: string, diaryId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_DIARY_DETAIL(calendarId, diaryId)
  );
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
};
