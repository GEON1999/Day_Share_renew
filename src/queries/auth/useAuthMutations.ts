// useAuthMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Login Function
const login = async (body: any) => {
  const { data } = await axios.post(Helper.CURRENT_URL() + API.LOGIN, body);
  return data;
};

// Signup Function
const signup = async (body: any) => {
  const { data } = await axios.post(Helper.CURRENT_URL() + API.SIGNUP, body);
  return data;
};

export default {
  login,
  signup,
};
