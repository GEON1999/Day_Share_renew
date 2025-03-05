const CURRENT_URL = (): string => {
  let origin: string =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "";
  origin = origin === "" ? process.env.DOMAIN || "" : origin;

  return origin;
};

const CURRENT_BASE_URL = (): string | undefined => {
  return typeof window !== "undefined"
    ? window.location.origin
    : process.env.BASE_URL;
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

const formatDateForTodo = (dateString: string | number): string => {
  const date = new Date(Number(dateString));
  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}. ${month}. ${day}`;
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

const formatDateForContent = (dateString: string): string => {
  const utcDate = new Date(dateString);
  const korDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  const year = korDate.getFullYear();
  const month = (korDate.getMonth() + 1).toString().padStart(2, "0");
  const day = korDate.getDate().toString().padStart(2, "0");
  const hours = korDate.getHours().toString().padStart(2, "0");
  const minutes = korDate.getMinutes().toString().padStart(2, "0");

  return `${year}.${month}.${day}. ${hours}:${minutes}`;
};

const formatTimeForInput = (timeString: string): string => {
  const date = new Date(timeString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

// format date like 2024. 11. 10. 오후 01:00
const formatDateForComment = (dateString: string): string => {
  const utcDate = new Date(dateString);
  const korDate = new Date(utcDate.getTime() + 9 * 60 * 60 * 1000);

  const year = korDate.getFullYear();
  const month = (korDate.getMonth() + 1).toString().padStart(2, "0");
  const day = korDate.getDate().toString().padStart(2, "0");
  const hours = korDate.getHours() % 12 || 12;
  const minutes = korDate.getMinutes().toString().padStart(2, "0");
  const ampm = korDate.getHours() >= 12 ? "오후" : "오전";

  return `${year}.${month}.${day}. ${ampm} ${hours}:${minutes}`;
};

const formatTimeForTodoDetail = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const startHours = startDate.getHours() % 12 || 12;
  const startMinutes = startDate.getMinutes().toString().padStart(2, "0");
  const endHours = endDate.getHours() % 12 || 12;
  const endMinutes = endDate.getMinutes().toString().padStart(2, "0");
  const startAmpm = startDate.getHours() >= 12 ? "오후" : "오전";
  const endAmpm = endDate.getHours() >= 12 ? "오후" : "오전";

  return `${startAmpm} ${startHours}:${startMinutes} ~ ${endAmpm} ${endHours}:${endMinutes}`;
};

const formatDateForChat = (dateString: string): string => {
  const utcDate = new Date(dateString);
  const korDate = new Date(utcDate.getTime());

  const hours = korDate.getHours() % 12 || 12;
  const minutes = korDate.getMinutes().toString().padStart(2, "0");
  const ampm = korDate.getHours() >= 12 ? "오후" : "오전";

  return `${ampm} ${hours}:${minutes}`;
};

const formatTimeForTodo = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

// "1735570800000" -> 12.10(월)
const formatDateForTodoDetail = (
  dateString: string,
  isYear: boolean = false
): string => {
  const date = new Date(Number(dateString));
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayOfWeek = date.toLocaleDateString("ko-KR", { weekday: "short" });

  if (isYear) {
    return `${date.getFullYear()}. ${month}. ${day}.(${dayOfWeek})`;
  } else {
    return `${month}.${day}.(${dayOfWeek})`;
  }
};

const cleanContent = (content: any) => {
  return content
    .replace(/<p>/g, "") // <p> 태그 제거
    .replace(/<\/p>/g, ""); // </p> 태그 제거
};

// 추후 일정 선택 기능을 염두
const setAt = ({ startAt, endAt, startTime, endTime }: any) => {
  const startDate = new Date(Number(startAt));
  const endDate = new Date(Number(endAt));

  const [startHours, startMinutes] = startTime.split(":");
  const [endHours, endMinutes] = endTime.split(":");

  startDate.setHours(Number(startHours), Number(startMinutes), 0);
  endDate.setHours(Number(endHours), Number(endMinutes), 0);

  return {
    startAt: startDate.toISOString(),
    endAt: endDate.toISOString(),
  };
};

const isDateOlderThanOneDay = (date: string) => {
  const createdDate = new Date(date);
  const today = new Date();

  const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);

  return createdDate < oneDayAgo;
};

const getTodayMs = () => {
  const now = new Date();
  return Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    0,
    0,
    0,
    0
  );
};

const cutString = (str: string, maxLength: number) => {
  return str.length > maxLength ? `${str.slice(0, maxLength)} ...` : str;
};

const getKoreanHolidays = (title: string) => {
  if (!title) return "";

  if (title.includes("쉬는 날")) {
    // "쉬는 날 삼일절" -> "삼일절 대체공휴일"
    const holidayName = title.replace("쉬는 날", "").trim();
    return `${holidayName} 대체공휴일`;
  }
  return title;
};

export default {
  CURRENT_URL,
  CURRENT_BASE_URL,
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
  formatDateForContent,
  formatDateForComment,
  formatDateForTodo,
  formatTimeForTodo,
  formatTimeForTodoDetail,
  formatDateForTodoDetail,
  cutString,
  formatDateForChat,
  getKoreanHolidays,
};
