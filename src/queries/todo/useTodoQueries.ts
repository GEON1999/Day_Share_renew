// useTodoQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";
import { use } from "react";

// Get Todos by Date
const getTodos = async (calendarId: number, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_TODOS(calendarId, query)
  );
  return data;
};

const useGetTodos = (calendarId: number, query: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODOS, calendarId, query],
    queryFn: () => getTodos(calendarId, query),
  });
};

// Get Todo Detail
const getTodoDetail = async (calendarId: number, todoId: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_TODO_DETAIL(calendarId, todoId)
  );
  return data;
};

const useGetTodoDetail = (calendarId: number, todoId: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODO_DETAIL, calendarId, todoId],
    queryFn: () => getTodoDetail(calendarId, todoId),
  });
};

// Get Todos by calendarId
const getTodosByCalendarId = async (calendarId: string, query: string) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_CALENDAR_TODOS(calendarId, query)
  );
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
};
