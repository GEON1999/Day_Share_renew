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

const formatWithoutYear = (dateString: string): string => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${month}/${day}`;
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

const cleanContent = (content: any) => {
  return content
    .replace(/<p>/g, "") // <p> 태그 제거
    .replace(/<\/p>/g, ""); // </p> 태그 제거
};

const setAt = ({ data, formData }: any) => {
  const originalStartDate = new Date();
  const originalEndDate = new Date();

  if (data) {
    originalStartDate.setTime(Date.parse(data.startAt));
    originalEndDate.setTime(Date.parse(data.endAt));
  }
  const [startHours, startMinutes] = formData.startAt.split(":");
  const [endHours, endMinutes] = formData.endAt.split(":");

  originalStartDate.setUTCHours(startHours, startMinutes);
  originalEndDate.setUTCHours(endHours, endMinutes);

  return {
    startAt: originalStartDate.toISOString(),
    endAt: originalEndDate.toISOString(),
  };
};

const isDateOlderThanOneDay = (date: string) => {
  const createdDate = new Date(date);
  const today = new Date();

  const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  return createdDate < oneDayAgo;
};

const getTodayMs = () => new Date().setHours(0, 0, 0, 0);

export default {
  CURRENT_URL,
  queryToString,
  formatTime,
  formatDate,
  formatDateTimeLocal,
  formatTimeForInput,
  cleanContent,
  setAt,
  isDateOlderThanOneDay,
  getTodayMs,
  formatWithoutYear,
};
