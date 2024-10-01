// useCommentMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Create Comment
const createComment = async ({ calendarId, query, body }: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.CREATE_COMMENT(calendarId, query),
    body
  );
  return data;
};

// Update Comment
const updateComment = async ({ calendarId, commentId, body }: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_COMMENT(calendarId, commentId),
    body
  );
  return data;
};

// Delete Comment
const deleteComment = async ({ calendarId, commentId }: any) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_COMMENT(calendarId, commentId)
  );
  return data;
};

export default {
  createComment,
  updateComment,
  deleteComment,
};
