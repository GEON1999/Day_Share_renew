const CURRENT_URL = (): string => {
  let origin: string =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  origin = origin === "" ? process.env.DOMAIN || "" : origin;

  return origin;
};

type Query = {
  [key: string]: string | null | undefined;
};

const queryToString = (query: Query): string => {
  Object.keys(query).forEach(
    (k) =>
      (query[k] === null || query[k] === undefined || query[k] === "") &&
      delete query[k]
  );
  return Object.keys(query)
    .map((key) => key + "=" + encodeURIComponent(query[key]!))
    .join("&");
};

const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}시 ${minutes}분`;
};

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}년 ${month}월 ${day}일`;
};

const formatDateTimeLocal = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const formatTimeForInput = (timeString: string): string => {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

export default {
  CURRENT_URL,
  queryToString,
  formatTime,
  formatDate,
  formatDateTimeLocal,
  formatTimeForInput,
};
