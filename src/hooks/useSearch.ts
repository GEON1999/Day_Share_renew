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

const useSearchDiaryId = () => {
  const params = useParams();
  return Array.isArray(params.diaryId) ? params.diaryId[0] : params.diaryId;
};

const useSearchPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("page") ?? "1";
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

export default {
  useSearchQueries,
  useSearchId,
  useSearchTodoId,
  useSearchDiaryId,
  useSearchPage,
  useSearchDiaryPage,
  useParamsAll,
  useSearchTodoPage,
  useSearchDate,
};
