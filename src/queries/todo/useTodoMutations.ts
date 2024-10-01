// useTodoMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Create Todo
const createTodo = async ({ calendarId, query, body }: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.CREATE_TODO(calendarId, query),
    body
  );
  return data;
};

// Update Todo
const updateTodo = async ({ calendarId, todoId, body }: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_TODO(calendarId, todoId),
    body
  );
  return data;
};

// Delete Todo
const deleteTodo = async ({ calendarId, todoId }: any) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_TODO(calendarId, todoId)
  );
  return data;
};

// Toggle Todo Completion
const toggleTodoComplete = async ({ calendarId, todoId }: any) => {
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
