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
import ModalWrapper from "@/components/modal/ModalWrapper";
import EditCommentModal from "@/components/modal/EditCommentModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import DeleteModal from "@/components/modal/DeleteModal";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";
import { IconComment, IconHeart, IconNextRed } from "@/icons";

const TodoViewMode = ({ setEditorMode }: any) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [currentEditCommentData, setCurrentEditCommentData] = useState(null);
  const [openComment, setOpenComment] = useState(true);
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchTodoId();
  const date = useSearch.useSearchDate();
  const query = `contentType=todo&contentId=${todoId}`;

  const { register: commentRegister, handleSubmit: commentHandleSubmit } =
    useForm();

  const {
    data,
    isLoading,
    refetch: todoReFetch,
  } = useTodoQueries.useGetTodoDetail(id, todoId);
  const { data: userData } = useCalendarQueries.useGetCalendarUserInfo(id);
  const { data: calendarData } = useCalendarQueries.useGetCalendarBasic(id);
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

  const { mutate: toggleLike } = useMutation({
    mutationFn: useLikeMutations.toggleLike,
  });
  const { mutate: createComment } = useMutation({
    mutationFn: useCommentMutations.createComment,
  });
  const { mutate: deleteTodo } = useMutation({
    mutationFn: useTodoMutations.deleteTodo,
  });
  const { mutate: deleteComment } = useMutation({
    mutationFn: useCommentMutations.deleteComment,
  });

  const handleClickDeleteTodo = () => setIsTodoModalOpen(true);
  const handleClickCalendar = () => router.push(`/calendar/${id}?date=${date}`);
  const onCommentSubmit = debounce((data: any) => {
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
  }, StaticKeys.DEBOUNCE_TIME);

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

  const handleEditorMode = () => setEditorMode(true);
  const handleOpenComment = () => setOpenComment(!openComment);

  const handleDeleteComment = () => {
    deleteComment(
      { calendarId: id, commentId: currentCommentId },
      {
        onSuccess: (result) => {
          if (result) {
            alert("댓글 삭제에 성공하였습니다.");
          } else {
            alert("댓글 삭제에 실패하였습니다.");
          }
          window.location.reload();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleDeleteTodo = () => {
    deleteTodo(
      { calendarId: id, todoId },
      {
        onSuccess: () => {
          router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);
          console.log("success");
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  };

  return (
    <div className={`min-w-[600px] mt-[86px] w-[1270px]`}>
      <div
        className="flex items-center space-x-[10px] cur"
        onClick={handleClickCalendar}
      >
        <p className="text_red text-[20px]">{calendarData?.name}</p>
        <IconNextRed className="w-[9px] h-5" />
      </div>
      <div className="flex justify-between items-center mt-3">
        <p className="text-[30px] flex items-center space-x-5">
          <span>{data?.title}</span>
          <span className="font-thin">|</span>
          <span>
            {Helper.formatTimeForTodoDetail(data?.startAt, data?.endAt)}
          </span>
        </p>
        <div className="flex space-x-2">
          <button onClick={handleEditorMode} className="rounded w-15 h-10 bor">
            수정
          </button>
          <button
            type="button"
            onClick={handleClickDeleteTodo}
            className="rounded w-15 h-10 bor"
          >
            삭제
          </button>
          {/* <button className="rounded w-15 h-10 bor">공유</button> */}
        </div>
      </div>
      <div className="flex items-center mt-3">
        <img
          className="w-[50px] h-[50px] rounded-full bor"
          src={calendarProfile?.img ?? process.env.NEXT_PUBLIC_LOGO}
        />
        <div className="flex flex-col ml-2">
          <h1 className="ftext-[20px]">
            {calendarProfile?.name ?? "탈퇴한 유저"}
          </h1>
          <p className="text-[16px] text-[#969696]">
            {Helper.formatDateForContent(data?.createdAt)}
          </p>
        </div>
      </div>
      <div className="my-8 text-[22px]">{data?.content}</div>
      <div className="flex border-t space-x-4">
        <div className="flex items-center space-x-6 mt-[10px]">
          <div className="flex items-center space-x-2  ">
            <IconHeart onClick={handleToggleLike} className="w-5 h-5 cur" />
            <div>{likeData}</div>
          </div>
          <div className="flex items-center space-x-2">
            <IconComment onClick={handleOpenComment} className="w-5 h-5 cur" />
            <div>{commentData ? commentData.length : "0"}</div>
          </div>
        </div>
      </div>
      {openComment && (
        <div className="mt-[13px]">
          <div className="flex text-[22px] space-x-3">
            <h1 className="">댓글 </h1>
            <h1>{commentData?.length}</h1>
          </div>
          <div className="overflow-y-auto space-y-3">
            {commentData?.map((comment: any) => (
              <div
                key={comment.comment.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-start space-x-3 space-y-2">
                  <img
                    className="w-10 h-10 rounded-full bor mt-[7px]"
                    src={comment?.profile?.img ?? ""}
                  />
                  <div className="max-w-[1000px] space-y-[2px]">
                    <div className="flex items-center space-x-[15px]">
                      <h1 className="text-[16px] text-[#2D2D2E]">
                        {comment?.profile?.name}
                      </h1>
                      <p className="text-[13px] text-[#969696]">
                        {Helper.formatDateForComment(
                          comment?.comment?.createdAt
                        )}
                      </p>
                    </div>
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
                    onClick={() => handleClickDeleteComment(comment.comment.id)}
                    src="https://s3.ap-northeast-2.amazonaws.com/geon.com/test_1729079615050.png"
                    className="w-5 h-5 cur"
                  />
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={commentHandleSubmit(onCommentSubmit)}
            className="flex items-center mt-8 space-x-2"
          >
            <div className="bor w-full h-[162px] rounded py-[15px] px-[20px] flex flex-col space-y-[10px] justify-between">
              <div className="flex items-center space-x-[10px]">
                <img
                  className="w-10 h-10 rounded-full bor"
                  src={userData?.img ?? process.env.NEXT_PUBLIC_LOGO}
                />
                <h1 className="text-[16px] text-[#2D2D2E]">{userData?.name}</h1>
              </div>
              <input
                {...commentRegister("content")}
                className="w-full h-[18px] outline-none rounded bg-transparent text-[20px] placeholder:text-[#495163] px-[1px]"
                placeholder="댓글을 남겨보세요."
              />
              {/* 버튼을 가장 우측으로 이동 */}
              <button
                type="submit"
                className="w-[46px] bor h-[30px] rounded ml-auto"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      )}{" "}
      <ModalWrapper isOpen={isEditModalOpen} setIsOpen={setIsEditModalOpen}>
        <EditCommentModal
          setIsOpen={setIsEditModalOpen}
          commentData={currentEditCommentData}
        />
      </ModalWrapper>
      <ModalWrapper isOpen={isOpen} setIsOpen={setIsOpen}>
        <DeleteModal
          setIsOpen={setIsOpen}
          mutateFn={handleDeleteComment}
          msg="정말 해당 댓글을 삭제하시겠습니까?"
        />
      </ModalWrapper>
      <ModalWrapper isOpen={isTodoModalOpen} setIsOpen={setIsTodoModalOpen}>
        <DeleteModal
          setIsOpen={setIsTodoModalOpen}
          mutateFn={handleDeleteTodo}
          msg="정말 해당 일정을 삭제하시겠습니까?"
        />
      </ModalWrapper>
    </div>
  );
};

export default TodoViewMode;
