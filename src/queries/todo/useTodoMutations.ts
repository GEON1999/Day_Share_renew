// useTodoMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useMutation } from "@tanstack/react-query";

// Create Todo
const createTodo = async (calendarId: number, date: number, body: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.CREATE_TODO(calendarId, date),
    body
  );
  return data;
};

// Update Todo
const updateTodo = async (calendarId: number, todoId: number, body: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_TODO(calendarId, todoId),
    body
  );
  return data;
};

// Delete Todo
const deleteTodo = async (calendarId: number, todoId: number) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_TODO(calendarId, todoId)
  );
  return data;
};

// Toggle Todo Completion
const toggleTodoComplete = async (calendarId: number, todoId: number) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.TOGGLE_TODO_COMPLETE(calendarId, todoId)
  );
  return data;
};

export default {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
};
