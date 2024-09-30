// useUserQueries.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";
import { useQuery } from "@tanstack/react-query";
import QueryKeys from "@/keys/QueryKeys";

// Get User Info
const getUser = async () => {
  const { data } = await axios.get(Helper.CURRENT_URL() + API.GET_USER);
  return data;
};

const useGetUser = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER],
    queryFn: getUser,
  });
};

export default {
  useGetUser,
};
