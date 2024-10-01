// useDiaryMutations.ts
import axios from "axios";
import Helper from "@/helper/Helper";
import API from "@/server/API";

// Create Diary
const createDiary = async ({ calendarId, query, body }: any) => {
  const { data } = await axios.post(
    Helper.CURRENT_URL() + API.CREATE_DIARY(calendarId, query),
    body
  );
  return data;
};

// Update Diary
const updateDiary = async ({ calendarId, diaryId, body }: any) => {
  const { data } = await axios.put(
    Helper.CURRENT_URL() + API.UPDATE_DIARY(calendarId, diaryId),
    body
  );
  return data;
};

// Delete Diary
const deleteDiary = async ({ calendarId, diaryId }: any) => {
  const { data } = await axios.delete(
    Helper.CURRENT_URL() + API.DELETE_DIARY(calendarId, diaryId)
  );
  return data;
};

export default {
  createDiary,
  updateDiary,
  deleteDiary,
};
