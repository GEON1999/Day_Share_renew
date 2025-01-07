// useTodoMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

const BASE_URL = Helper.CURRENT_URL();

// Create Todo
const createTodo = async ({ calendarId, query, body }: any) => {
  const { data } = await axios.post(
    `${BASE_URL}${API.CREATE_TODO(calendarId, query)}`,
    body
  );
  return data;
};

// Update Todo
const updateTodo = async ({ calendarId, todoId, body }: any) => {
  const { data } = await axios.put(
    `${BASE_URL}${API.UPDATE_TODO(calendarId, todoId)}`,
    body
  );
  console.log("result data", data);
  return data;
};

// Delete Todo
const deleteTodo = async ({ calendarId, todoId }: any) => {
  const { data } = await axios.delete(
    `${BASE_URL}${API.DELETE_TODO(calendarId, todoId)}`
  );
  return data;
};

// Toggle Todo Completion
const toggleTodoComplete = async ({ calendarId, todoId }: any) => {
  const { data } = await axios.post(
    `${BASE_URL}${API.TOGGLE_TODO_COMPLETE(calendarId, todoId)}`
  );
  return data;
};

export default {
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoComplete,
};
