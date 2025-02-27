// useCalendarQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import rqOption from "@/server/rqOption";

// Get Calendar List
const getCalendarList = async (query: string, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_LIST(query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarList = (query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_LIST, query],
    queryFn: () => getCalendarList(query),
  });
};

// Get Calendar Select List
const getCalendarSelectList = async (accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_SELECT_LIST;

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarSelectList = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_SELECT_LIST],
    queryFn: getCalendarSelectList,
  });
};

// Get Calendar Dates
const getCalendarDates = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_DATES(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarDates = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_DATES, calendarId, query],
    queryFn: () => getCalendarDates(calendarId, query),
  });
};

// Get Calendar Basic Info
const getCalendarBasic = async (calendarId: string, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_BASIC(calendarId);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarBasic = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_BASIC, calendarId],
    queryFn: () => getCalendarBasic(calendarId),
  });
};

// Get Invite Code
const getInviteCode = async (calendarId: string, accessToken?: any) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_INVITE_CODE(calendarId);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetInviteCode = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_INVITE_CODE, calendarId],
    queryFn: () => getInviteCode(calendarId),
  });
};

// Get Calendar User Info
const getCalendarUserInfo = async (calendarId: string, accessToken?: any) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_USER_INFO(calendarId);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarUserInfo = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_USER_INFO, calendarId],
    queryFn: () => getCalendarUserInfo(calendarId),
  });
};

// Get Calendar Permission
const getCalendarPermission = async (calendarId: string, accessToken?: any) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_PERMISSION(calendarId);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarPermission = (calendarId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PERMISSION, calendarId],
    queryFn: () => getCalendarPermission(calendarId),
  });
};

// Get Calendar Permission List
const getCalendarPermissionList = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() +
    API.GET_CALENDAR_PERMISSION_LIST(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarPermissionList = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, calendarId, query],
    queryFn: () => getCalendarPermissionList(calendarId, query),
  });
};

// Get Calendar Profile
const getCalendarProfile = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_PROFILE(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetCalendarProfile = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PROFILE, calendarId, query],
    queryFn: () => getCalendarProfile(calendarId, query),
  });
};

// Get Calendar User
const getCalendarUser = async (
  calendarId: string,
  userId: string,
  query: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() +
    API.GET_CALENDAR_USER(calendarId, userId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
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
  useGetCalendarDates,
  useGetCalendarBasic,
  useGetInviteCode,
  useGetCalendarUserInfo,
  useGetCalendarPermission,
  useGetCalendarPermissionList,
  useGetCalendarProfile,
  useGetCalendarUser,
  getCalendarList,
  getCalendarSelectList,
  getCalendarDates,
  getCalendarBasic,
  getInviteCode,
  getCalendarUserInfo,
  getCalendarPermission,
  getCalendarPermissionList,
  getCalendarProfile,
  getCalendarUser,
};
