"use client";

import useSearch from "@/hooks/useSearch";
import useCommentMutations from "@/queries/comment/useCommentMutations";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeMutations from "@/queries/like/useLikeMutations";
import useLikeQueries from "@/queries/like/useLikeQueries";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "../modal/ModalWrapper";
import DeleteCommentModal from "../modal/DeleteCommentModal";
import EditCommentModal from "../modal/EditCommentModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";

const TodoDetail = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [currentEditCommentData, setCurrentEditCommentData] = useState(null);
  const [editorMode, setEditorMode] = useState(false);
  const [openComment, setOpenComment] = useState(true);
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchTodoId();
  const query = `contentType=todo&contentId=${todoId}`;

  const { register, handleSubmit } = useForm();
  const { register: commentRegister, handleSubmit: commentHandleSubmit } =
    useForm();

  const { data, isLoading } = useTodoQueries.useGetTodoDetail(id, todoId);
  const {
    data: commentData,
    isLoading: commentIsLoading,
    refetch: commentRefetch,
  } = useCommentQueries.useGetComments(id, query);
  const {
    data: likeData,
    isLoading: likeIsLoading,
    refetch,
  } = useLikeQueries.useGetLikes(query);
  const { data: calendarProfile, isLoading: calendarProfileIsLoading } =
    useCalendarQueries.useGetCalendarProfile(id, `userId=${data?.userId}`);
  console.log("data :", data);

  const { mutate: toggleLike } = useMutation({
    mutationFn: useLikeMutations.toggleLike,
  });
  const { mutate: createComment } = useMutation({
    mutationFn: useCommentMutations.createComment,
  });
  const { mutate: deleteTodo } = useMutation({
    mutationFn: useTodoMutations.deleteTodo,
  });
  const { mutate: updateTodo } = useMutation({
    mutationFn: useTodoMutations.updateTodo,
  });

  const onCommentSubmit = (data: any) => {
    createComment({ calendarId: id, query, body: data }),
      {
        onSuccess: () => {
          refetch();
          console.log("success");
          commentRefetch();
        },
        onError: () => {
          console.log("error");
        },
      };
    console.log(data);
  };

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

  const handleClickDeleteComment = (commentId: string) => {
    setIsOpen(true);
    setCurrentCommentId(commentId);
  };

  const handleClickEditComment = (commentData: any) => {
    setIsEditModalOpen(true);
    setCurrentEditCommentData(commentData);
  };

  const handleEditorMode = () => setEditorMode(!editorMode);
  const handleOpenComment = () => setOpenComment(!openComment);

  return (
    <div className="main_container">
      {editorMode ? (
        <div></div>
      ) : (
        <div className="max-w-[1000px] min-w-[600px] px-20 mt-20">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <img
                className="w-10 h-10 rounded-full bor"
                src={calendarProfile?.img}
              />
              <h1 className="font-bold text-xl ml-2">
                {calendarProfile?.name}
              </h1>
            </div>
            <button
              onClick={handleEditorMode}
              className="bg-[#E0CBB7] rounded px-4 py-2 bor"
            >
              수정
            </button>
          </div>
          <div className="flex flex-col space-y-4 mt-8">
            <h2 className="text-xl font-bold text-center">{data?.title}</h2>
            <p>{data?.content}</p>
          </div>
          <div className="flex border-t-2 border-b-2 py-4 my-4 mt-10 space-x-4">
            <div className="flex items-center space-x-2">
              <img
                onClick={handleToggleLike}
                className="w-5 h-5 cur"
                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076426211.png"
              />
              <div>{likeData}</div>
            </div>
            <div className="flex items-center space-x-2">
              <img
                onClick={handleOpenComment}
                src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729076565076.png"
                className="w-5 h-5 cur"
              />
              <div>{commentData.length}</div>
            </div>
          </div>
          {openComment && (
            <div>
              <h1 className="font-bold text-xl mb-5">댓글</h1>
              {commentData?.map((comment: any) => (
                <div
                  key={comment.comment.id}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2 space-y-2">
                    <div>
                      <img
                        className="w-10 h-10 rounded-full bor"
                        src={comment.profile.img}
                      />
                    </div>
                    <div>
                      <h1 className="font-bold">{comment.profile.name}</h1>
                      <p>{comment.comment.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <img
                      onClick={() => {
                        handleClickEditComment(comment.comment);
                      }}
                      src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729079582327.png"
                      className="w-5 h-5 cur"
                    />
                    <img
                      onClick={() =>
                        handleClickDeleteComment(comment.comment.id)
                      }
                      src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729079615050.png"
                      className="w-5 h-5 cur"
                    />
                  </div>
                </div>
              ))}
              <form
                onSubmit={commentHandleSubmit(onCommentSubmit)}
                className="flex items-center mt-5 space-x-2"
              >
                <input
                  {...commentRegister("content")}
                  className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
                  placeholder="댓글을 입력해주세요"
                />
                <button
                  type="submit"
                  className="w-20 bg-[#E0CBB7] bor h-10 rounded"
                >
                  저장
                </button>
              </form>
            </div>
          )}
        </div>
      )}
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DeleteCommentModal
          setIsOpen={setIsOpen}
          commentId={currentCommentId}
        />
      </ModalWrapper>
      <ModalWrapper isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen}>
        <EditCommentModal
          setIsOpen={setIsEditModalOpen}
          commentData={currentEditCommentData}
        />
      </ModalWrapper>
    </div>
  );
};

export default TodoDetail;
