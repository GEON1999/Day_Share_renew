// useTodoQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get Todos by Date
const getTodos = async (calendarId: number, date: number) => {
  const { data } = await axios.get(
    Helper.CURRENT_URL() + API.GET_TODOS(calendarId, date)
  );
  return data;
};

const useGetTodos = (calendarId: number, date: number) => {
  return useQuery({
    queryKey: [QueryKeys.GET_TODOS, calendarId, date],
    queryFn: () => getTodos(calendarId, date),
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

export default {
  useGetTodos,
  useGetTodoDetail,
};
