"use client";
import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import commonMutation from "@/queries/commonMutation";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";
import { useState } from "react";

const ClientPage = () => {
  const queries = useSearch.useSearchQueries();
  const [page, setPage] = useState(1);

  const { data: diaryData, isLoading: diaryIsLoading } =
    useUserQueries.useGetUserDiaries("page=1");
  console.log("data :", diaryData, diaryIsLoading);
  const { data: todoData, isLoading: todoIsLoading } =
    useUserQueries.useGetUserTodos("page=1");
  console.log("todoData :", todoData, todoIsLoading);
  const { data: calendarData, isLoading: calendarIsLoading } =
    useCalendarQueries.useGetCalendarList(queries ?? "");
  console.log("calendarData :", calendarData, calendarIsLoading);
  const { data: userData, isLoading: userIsLoading } =
    useUserQueries.useGetUser();
  console.log("userData :", userData, userIsLoading);

  const { mutate: uploadImage } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  return (
    <div>
      <button className="" onClick={() => signOut()}>
        로그아웃
      </button>
      <input type="file" id="image" />
    </div>
  );
};

export default ClientPage;
