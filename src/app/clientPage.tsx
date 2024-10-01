"use client";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useUserMutations from "@/queries/user/useUserMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import { signOut } from "next-auth/react";

const ClientPage = () => {
  // const { data, isLoading } = useUserQueries.useGetUser();
  // const { data: data2, isLoading: isLoading2 } =
  //   useCalendarQueries.useGetCalendarDetail(45);
  // console.log("data2 :", data2, isLoading2);
  // const { data: data3, isLoading: isLoading3 } =
  //   useCalendarQueries.useGetCalendarList("page=1");
  // console.log("data3 :", data3, isLoading3);
  // const { data: data4, isLoading: isLoading4 } = useDiaryQueries.useGetDiaries(
  //   45,
  //   `date=1727103600000`
  // );
  // console.log("data4 :", data4, isLoading4);
  const { mutate } = useMutation({ mutationFn: useUserMutations.updateUser });
  const { mutate: delUser } = useMutation({
    mutationFn: useUserMutations.deleteUser,
  });
  const { mutate: updateCalendar } = useMutation({
    mutationFn: useCalendarMutations.updateCalendar,
  });
  const { mutate: createDiary } = useMutation({
    mutationFn: useDiaryMutations.createDiary,
  });

  const clicked = () => {
    const body = {
      title: "John Doe",
      content: "string",
      img: "https://s3.ap-northeast-2.amazonaws.com/geon.com/1724381264948_1724381264948.png",
    };
    createDiary(
      { calendarId: 45, query: `date=1727103600000`, body },
      {
        onSuccess: (result) => {
          console.log("성공", result);
        },
        onError: (error) => {
          console.log("실패", error);
        },
      }
    );
  };

  const deleteUser = () => {
    delUser(
      {},
      {
        onSuccess: (result) => {
          console.log("성공", result);
        },
        onError: (error) => {
          console.log("실패", error);
        },
      }
    );
  };
  return (
    <div>
      <button onClick={clicked}>클릭!</button>
      <button onClick={deleteUser}>삭제!</button>
      <button onClick={() => signOut()}>로그아웃</button>
    </div>
  );
};

export default ClientPage;
