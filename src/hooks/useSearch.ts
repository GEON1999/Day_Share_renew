import { useSearchParams } from "next/navigation";

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

export default {
  useSearchQueries,
};
