// useDiaryQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Diaries by Date
const getDiaries = async (calendarId: number, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_DIARIES(calendarId, query)
  );
  return data;
};

const useGetDiaries = (calendarId: number, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_DIARIES, calendarId, query],
    queryFn: () => getDiaries(calendarId, query),
  });
};

// Get Diary Detail
const getDiaryDetail = async (calendarId: number, diaryId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_DIARY_DETAIL(calendarId, diaryId)
  );
  return data;
};

const useGetDiaryDetail = (calendarId: number, diaryId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_DIARY_DETAIL, calendarId, diaryId],
    queryFn: () => getDiaryDetail(calendarId, diaryId),
  });
};

// Get Calendar Profile
const getCalendarProfile = async (calendarId: number, qeury: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PROFILE(calendarId, qeury)
  );
  return data;
};

const useGetCalendarProfile = (calendarId: number, qeury: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PROFILE, calendarId, qeury],
    queryFn: () => getCalendarProfile(calendarId, qeury),
  });
};

export default {
  useGetDiaries,
  useGetDiaryDetail,
  useGetCalendarProfile,
};
