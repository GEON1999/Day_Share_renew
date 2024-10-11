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

const useSearchPage = () => {
  const searchParams = useSearchParams();
  return searchParams.get("page") ?? "1";
};

export default {
  useSearchQueries,
  useSearchId,
  useSearchPage,
};
