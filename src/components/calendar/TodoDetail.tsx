"use client";

import useSearch from "@/hooks/useSearch";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeMutations from "@/queries/like/useLikeMutations";
import useLikeQueries from "@/queries/like/useLikeQueries";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";

const TodoDetail = () => {
  const [editorMode, setEditorMode] = useState(false);
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchTodoId();
  const query = `contentType=todo&contentId=${todoId}`;
  useEffect(() => {
    document.querySelector("body")?.classList.add("bg-[#EFDACC]");
  }, []);

  const { data, isLoading } = useTodoQueries.useGetTodoDetail(id, todoId);
  const { data: commentData, isLoading: commentIsLoading } =
    useCommentQueries.useGetComments(id, query);
  const {
    data: likeData,
    isLoading: likeIsLoading,
    refetch,
  } = useLikeQueries.useGetLikes(query);
  console.log("todo :", data, isLoading);
  console.log("commentData :", commentData, commentIsLoading);
  console.log("likeData :", likeData, likeIsLoading);

  const { mutate: toggleLike } = useMutation({
    mutationFn: useLikeMutations.toggleLike,
  });

  const handleToggleLike = () => {
    toggleLike(query, {
      onSuccess: () => {
        refetch();
        console.log("success");
      },
      onError: () => {
        console.log("error");
      },
    });
  };

  const handleEditorMode = () => setEditorMode(!editorMode);

  return (
    <div className="main_container">
      {editorMode ? (
        <div></div>
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <div></div>
            <button
              onClick={handleEditorMode}
              className="bg-[#E0CBB7] rounded px-4 py-2 bor"
            >
              수정하기
            </button>
          </div>
          <div className="flex flex-col px-20 space-y-4 mt-20">
            <h2 className="text-xl font-bold text-center">{data?.title}</h2>
            <p>{data?.content}</p>
          </div>
          <div className="flex border-t-2 border-b-2 py-4 my-4 mt-10 space-x-4">
            <div className="flex items-center space-x-2">
              <img
                onClick={handleToggleLike}
                className="w-8 h-8 cur"
                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076426211.png"
              />
              <div>{likeData}</div>
            </div>
            <div className="flex items-center space-x-2">
              <img
                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076565076.png"
                className="w-8 h-8 cur"
              />
              <div>{commentData.length}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoDetail;
