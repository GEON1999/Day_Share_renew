"use client";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import commonMutation from "@/queries/commonMutation";
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
  const { data: data5, isLoading: isLoading5 } =
    useCommentQueries.useGetComments(45, "contentId=57&contentType=diary");
  console.log("data5 :", data5, isLoading5);
  console.log("data5 :", data5, isLoading5);
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
  const { mutate: uploadImage } = useMutation({
    mutationFn: commonMutation.uploadImage,
  });

  const clicked = () => {
    const file = document.getElementById("image");
    if (!file) return;
    console.log("file :", file.files[0]);
    uploadImage(file.files[0], {
      onSuccess: (result) => {
        console.log("성공", result);
      },
      onError: (error) => {
        console.log("실패", error);
      },
    });
    // const body = {
    //   title: "John Doe",
    //   content: "string",
    //   img: "https://s3.ap-northeast-2.amazonaws.com/geon.com/1724381264948_1724381264948.png",
    // };
    // createDiary(
    //   { calendarId: 45, query: `date=1727103600000`, body },
    //   {
    //     onSuccess: (result) => {
    //       console.log("성공", result);
    //     },
    //     onError: (error) => {
    //       console.log("실패", error);
    //     },
    //   }
    // );
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
      <input type="file" id="image" />
    </div>
  );
};

export default ClientPage;
