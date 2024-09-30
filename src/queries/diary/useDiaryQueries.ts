// useDiaryQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Diaries by Date
const getDiaries = async (calendarId: number, date: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_DIARIES(calendarId, date)
  );
  return data;
};

const useGetDiaries = (calendarId: number, date: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_DIARIES, calendarId, date],
    queryFn: () => getDiaries(calendarId, date),
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
const getCalendarProfile = async (calendarId: number, userId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PROFILE(calendarId, userId)
  );
  return data;
};

const useGetCalendarProfile = (calendarId: number, userId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PROFILE, calendarId, userId],
    queryFn: () => getCalendarProfile(calendarId, userId),
  });
};

export default {
  useGetDiaries,
  useGetDiaryDetail,
  useGetCalendarProfile,
};
