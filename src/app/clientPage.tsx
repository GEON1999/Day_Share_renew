"use client";

import useUserMutations from "@/queries/user/useUserMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";

const ClientPage = () => {
  const { data, isLoading } = useUserQueries.useGetUser();
  const { mutate } = useMutation({ mutationFn: useUserMutations.updateUser });
  const { mutate: delUser } = useMutation({
    mutationFn: useUserMutations.deleteUser,
  });

  const clicked = () => {
    mutate(
      {
        name: "John Doe",
        img: "https://s3.ap-northeast-2.amazonaws.com/geon.com/1724381264948_1724381264948.png",
      },
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

  console.log("data :", data, isLoading);
  return (
    <div>
      <button onClick={clicked}>클릭!</button>
      <button onClick={deleteUser}>삭제!</button>
    </div>
  );
};

export default ClientPage;
