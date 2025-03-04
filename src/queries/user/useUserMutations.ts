// useUserMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Update User Info
const updateUser = async (body: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_USER,
    body
  );
  return data;
};

// Delete User
const deleteUser = async () => {
  const { data } = await axios.delete(Helper.CURRENT_URL() + API.DELETE_USER);
  return data;
};

// Update FCM Token
const updateFcmToken = async (token: string) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_FCM_TOKEN(token)
  );
  return data;
};

// post user favorite todos
const postUserFavoriteTodo = async (todoId: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() +
      API.ADD_USER_FAVORITE_TODO(`todo_id=${todoId.todoId}`),
    {}
  );
  return data;
};

// delete user favorite todos
const deleteUserFavoriteTodo = async () => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_USER_FAVORITE_TODO
  );
  return data;
};

// update user calendar order
const updateUserCalendarOrder = async (orders: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_USER_CALENDAR_ORDER,
    orders
  );
  return data;
};

// update user password
const updateUserPassword = async (body: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_USER_PASSWORD,
    body
  );
  return data;
};

// update user emotion
const updateUserEmotion = async (body: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_USER_EMOTION,
    body
  );
  return data;
};

export default {
  updateUser,
  deleteUser,
  updateFcmToken,
  postUserFavoriteTodo,
  deleteUserFavoriteTodo,
  updateUserCalendarOrder,
  updateUserPassword,
  updateUserEmotion,
};
