// useCalendarMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Create Calendar
const createCalendar = async (body: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.CREATE_CALENDAR,
    body
  );
  return data;
};

// Delete Calendar
const deleteCalendar = async (calendarId: number) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_CALENDAR(calendarId)
  );
  return data;
};

// Update Calendar
const updateCalendar = async (calendarId: number, body: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_CALENDAR(calendarId),
    body
  );
  return data;
};

// Create Invite Code
const createInviteCode = async (calendarId: number) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.CREATE_INVITE_CODE(calendarId)
  );
  return data;
};

// Delete Invite Code
const deleteInviteCode = async (calendarId: number) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_INVITE_CODE(calendarId)
  );
  return data;
};

// Join Calendar
const joinCalendar = async (body: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.JOIN_CALENDAR,
    body
  );
  return data;
};

// Update Calendar User Info
const updateCalendarUserInfo = async (calendarId: number, body: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_CALENDAR_USER_INFO(calendarId),
    body
  );
  return data;
};

// Delete Calendar Permission (Specific User)
const deleteCalendarPermission = async (calendarId: number, userId: number) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_CALENDAR_PERMISSION(calendarId, userId)
  );
  return data;
};

// Leave Calendar (User Removes Themselves)
const leaveCalendar = async (calendarId: number) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.LEAVE_CALENDAR(calendarId)
  );
  return data;
};

// Remove User from Calendar (Owner Removes Another User)
const removeUserFromCalendar = async (calendarId: number, userId: number) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.REMOVE_USER_FROM_CALENDAR(calendarId, userId)
  );
  return data;
};

export default {
  createCalendar,
  deleteCalendar,
  updateCalendar,
  createInviteCode,
  deleteInviteCode,
  joinCalendar,
  updateCalendarUserInfo,
  deleteCalendarPermission,
  leaveCalendar,
  removeUserFromCalendar,
};
