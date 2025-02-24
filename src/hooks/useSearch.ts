import { useParams, useSearchParams } from "next/navigation";

const useSearchQueries = () => {
  const searchParams = useSearchParams();
  const query: Record<string, string> = {};

  searchParams.forEach((value, key) => {
    if (value !== null && value !== undefined && value !== "") {
      query[key] = value;
    }
  });

  const queryString = Object.keys(query)
    .map((key) => key + "=" + encodeURIComponent(query[key]))
    .join("&");

  return queryString === "" ? undefined : queryString;
};

const useSearchId = () => {
  const params = useParams();
  return Array.isArray(params.id) ? params.id[0] : params.id;
};

const useSearchTodoId = () => {
  const params = useParams();
  return Array.isArray(params.todoId) ? params.todoId[0] : params.todoId;
};

const useSearchQueryTodoId = () => {
  const searchParams = useSearchParams();
  const todoId = searchParams.get("todoId");
  return todoId ? todoId : undefined;
};

const useSearchDiaryId = () => {
  const params = useParams();
  return Array.isArray(params.diaryId) ? params.diaryId[0] : params.diaryId;
};

const useSearchPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("page") ?? "1";
};

const useSearchCreateContentHomePage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("create_content_home_page") ?? "1";
};

const useSearchCalendarTodoPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("calendar_todo_page") ?? "1";
};

const useSearchCalendarDiaryPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("calendar_diary_page") ?? "1";
};

const useSearchDiaryPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("diary_page") ?? "1";
};

const useSearchTodoPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("todo_page") ?? "1";
};

const useSearchDate = () => {
  const searchParams = useSearchParams();
  return searchParams.get("date") ?? "";
};

const useParamsAll = () => {
  const searchParams = useSearchParams();
  return new URLSearchParams(Array.from(searchParams.entries()));
};

const useSearchUserPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("user_page") ?? "1";
};

const useSearchContentType = () => {
  const searchParams = useSearchParams();
  return searchParams.get("content_type") ?? "";
};

const useSearchProfileId = () => {
  const params = useParams();
  return Array.isArray(params.profileId)
    ? params.profileId[0]
    : params.profileId;
};

const useSearchChatId = () => {
  const params = useParams();
  return Array.isArray(params.chatId) ? params.chatId[0] : params.chatId;
};

const useSearchChatPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("chat_page") ?? "1";
};

const useSearchChatSize = () => {
  const searchParams = useSearchParams();
  return searchParams.get("chat_size") ?? "10";
};
export default {
  useSearchQueries,
  useSearchId,
  useSearchTodoId,
  useSearchQueryTodoId,
  useSearchDiaryId,
  useSearchPage,
  useSearchCreateContentHomePage,
  useSearchDiaryPage,
  useParamsAll,
  useSearchTodoPage,
  useSearchDate,
  useSearchCalendarTodoPage,
  useSearchCalendarDiaryPage,
  useSearchUserPage,
  useSearchContentType,
  useSearchProfileId,
  useSearchChatId,
  useSearchChatPage,
  useSearchChatSize,
};
