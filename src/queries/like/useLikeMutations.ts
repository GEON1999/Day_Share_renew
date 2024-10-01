// useLikeMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Toggle Like
const toggleLike = async (query: string) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.TOGGLE_LIKE(query),
    {}
  );
  return data;
};

export default {
  toggleLike,
};
