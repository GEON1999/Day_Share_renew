// useCalendarQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Calendar List
const getCalendarList = async (page: number = 1) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_LIST(page)
  );
  return data;
};

const useGetCalendarList = (page: number = 1) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_LIST, page],
    queryFn: () => getCalendarList(page),
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
const getCalendarDetail = async (calendarId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_DETAIL(calendarId)
  );
  return data;
};

const useGetCalendarDetail = (calendarId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_DETAIL, calendarId],
    queryFn: () => getCalendarDetail(calendarId),
  });
};

// Get Calendar Basic Info
const getCalendarBasic = async (calendarId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_BASIC(calendarId)
  );
  return data;
};

const useGetCalendarBasic = (calendarId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_BASIC, calendarId],
    queryFn: () => getCalendarBasic(calendarId),
  });
};

// Get Invite Code
const getInviteCode = async (calendarId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_INVITE_CODE(calendarId)
  );
  return data;
};

const useGetInviteCode = (calendarId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_INVITE_CODE, calendarId],
    queryFn: () => getInviteCode(calendarId),
  });
};

// Get Calendar User Info
const getCalendarUserInfo = async (calendarId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_USER_INFO(calendarId)
  );
  return data;
};

const useGetCalendarUserInfo = (calendarId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_USER_INFO, calendarId],
    queryFn: () => getCalendarUserInfo(calendarId),
  });
};

// Get Calendar Permission
const getCalendarPermission = async (calendarId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PERMISSION(calendarId)
  );
  return data;
};

const useGetCalendarPermission = (calendarId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PERMISSION, calendarId],
    queryFn: () => getCalendarPermission(calendarId),
  });
};

// Get Calendar Permission List
const getCalendarPermissionList = async (calendarId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_PERMISSION_LIST(calendarId)
  );
  return data;
};

const useGetCalendarPermissionList = (calendarId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_PERMISSION_LIST, calendarId],
    queryFn: () => getCalendarPermissionList(calendarId),
  });
};

export default {
  useGetCalendarList,
  useGetCalendarSelectList,
  useGetCalendarDetail,
  useGetCalendarBasic,
  useGetInviteCode,
  useGetCalendarUserInfo,
  useGetCalendarPermission,
  useGetCalendarPermissionList,
};
