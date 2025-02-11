// useCalendarQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Calendar List
const getCalendarList = async (query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_LIST(query)
  );
  return data;
};

const useGetCalendarList = (query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_LIST, query],
    queryFn: () => getCalendarList(query),
  });
};

// Get Calendar Select List
const getCalendarSelectList = async () => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_SELECT_LIST
  );
  return data;
};

const useGetCalendarSelectList = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_SELECT_LIST],
    queryFn: getCalendarSelectList,
  });
};

// Get Calendar Detail
const getCalendarDetail = async (calendarId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_DETAIL(calendarId)
  );
  return data;
};

const useGetCalendarDetail = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_DETAIL, calendarId],
    queryFn: () => getCalendarDetail(calendarId),
  });
};

// Get Calendar Dates
const getCalendarDates = async (calendarId: string, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_DATES(calendarId, query)
  );
  return data;
};

const useGetCalendarDates = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_DATES, calendarId, query],
    queryFn: () => getCalendarDates(calendarId, query),
  });
};

// Get Calendar Basic Info
const getCalendarBasic = async (calendarId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_BASIC(calendarId)
  );
  return data;
};

const useGetCalendarBasic = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_BASIC, calendarId],
    queryFn: () => getCalendarBasic(calendarId),
  });
};

// Get Invite Code
const getInviteCode = async (calendarId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_INVITE_CODE(calendarId)
  );
  return data;
};

const useGetInviteCode = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_INVITE_CODE, calendarId],
    queryFn: () => getInviteCode(calendarId),
  });
};

// Get Calendar User Info
const getCalendarUserInfo = async (calendarId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_USER_INFO(calendarId)
  );
  return data;
};

const useGetCalendarUserInfo = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_USER_INFO, calendarId],
    queryFn: () => getCalendarUserInfo(calendarId),
  });
};

// Get Calendar Permission
const getCalendarPermission = async (calendarId: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PERMISSION(calendarId)
  );
  return data;
};

const useGetCalendarPermission = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PERMISSION, calendarId],
    queryFn: () => getCalendarPermission(calendarId),
  });
};

// Get Calendar Permission List
const getCalendarPermissionList = async (calendarId: string, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PERMISSION_LIST(calendarId, query)
  );
  return data;
};

const useGetCalendarPermissionList = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, calendarId, query],
    queryFn: () => getCalendarPermissionList(calendarId, query),
  });
};

// Get Calendar Profile
const getCalendarProfile = async (calendarId: string, qeury: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PROFILE(calendarId, qeury)
  );
  return data;
};

const useGetCalendarProfile = (calendarId: string, qeury: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PROFILE, calendarId, qeury],
    queryFn: () => getCalendarProfile(calendarId, qeury),
  });
};

// Get Calendar User
const getCalendarUser = async (
  calendarId: string,
  userId: string,
  query: string
) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_USER(calendarId, userId, query)
  );
  return data;
};

const useGetCalendarUser = (
  calendarId: string,
  userId: string,
  query: string
) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_USER, calendarId, userId, query],
    queryFn: () => getCalendarUser(calendarId, userId, query),
  });
};

export default {
  useGetCalendarList,
  useGetCalendarSelectList,
  useGetCalendarDetail,
  useGetCalendarDates,
  useGetCalendarBasic,
  useGetInviteCode,
  useGetCalendarUserInfo,
  useGetCalendarPermission,
  useGetCalendarPermissionList,
  useGetCalendarProfile,
  useGetCalendarUser,
};
