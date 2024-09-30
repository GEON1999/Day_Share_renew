// useLikeMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Toggle Like
const toggleLike = async (body: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.TOGGLE_LIKE,
    body
  );
  return data;
};

export default {
  toggleLike,
};
