// useTodoQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import { use } from "react";
import rqOption from "@/server/rqOption";

// Get Todos by Date
const getTodos = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url = Helper.CURRENT_BASE_URL() + API.GET_TODOS(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetTodos = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODOS, calendarId, query],
    queryFn: () => getTodos(calendarId, query),
  });
};

// Get Todo Detail
const getTodoDetail = async (
  calendarId: string,
  todoId: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_TODO_DETAIL(calendarId, todoId);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetTodoDetail = (calendarId: string, todoId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODO_DETAIL, calendarId, todoId],
    queryFn: () => getTodoDetail(calendarId, todoId),
  });
};

// Get Todos by calendarId
const getTodosByCalendarId = async (
  calendarId: string,
  query: string,
  accessToken?: any
) => {
  const url =
    Helper.CURRENT_BASE_URL() + API.GET_CALENDAR_TODOS(calendarId, query);

  const config =
    typeof window === "undefined"
      ? rqOption.apiHeader(accessToken)
      : { headers: { "Content-Type": "application/json" } };

  const { data } = await axios.get(url, config);
  return data;
};

const useGetTodosByCalendarId = (calendarId: string, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_CALENDAR_TODOS, calendarId, query],
    queryFn: () => getTodosByCalendarId(calendarId, query),
  });
};

export default {
  useGetTodos,
  useGetTodoDetail,
  useGetTodosByCalendarId,
  getTodos,
  getTodoDetail,
  getTodosByCalendarId,
};
