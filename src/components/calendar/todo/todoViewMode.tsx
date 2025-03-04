import useSearch from "@/hooks/useSearch";
import useCommentMutations from "@/queries/comment/useCommentMutations";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeMutations from "@/queries/like/useLikeMutations";
import useLikeQueries from "@/queries/like/useLikeQueries";
import useTodoMutations from "@/queries/todo/useTodoMutations";
import useTodoQueries from "@/queries/todo/useTodoQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "@/components/modal/ModalWrapper";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import DeleteModal from "@/components/modal/DeleteModal";
import { useRouter } from "next/navigation";
import {
  IconComment,
  IconEdit,
  IconHeart,
  IconHeartEmpty,
  IconX,
} from "@/icons";
import { useAlert } from "@/components/alert/AlertContext";
import { useModalStore } from "@/store/modalStore";
import { useSession } from "next-auth/react";

const TodoViewMode = ({ setEditorMode }: any) => {
  const { setCalendarDateModalOpen, setTodoDetailModalOpen } = useModalStore();
  const router = useRouter();
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [openComment, setOpenComment] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [isCommentSubmit, setIsCommentSubmit] = useState(false);
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchQueryTodoId();
  const query = `contentType=todo&contentId=${todoId}`;
  const { showAlert } = useAlert();
  const { data: session } = useSession();
  const sessionId = Number(session?.user?.id);

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeCommentId && menuRefs.current[activeCommentId]) {
        if (
          !menuRefs.current[activeCommentId]?.contains(event.target as Node)
        ) {
          setActiveCommentId(null);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeCommentId]);

  const {
    register: commentRegister,
    handleSubmit: commentHandleSubmit,
    reset: commentReset,
  } = useForm();

  const {
    register: editRegister,
    handleSubmit: editHandleSubmit,
    reset: editReset,
  } = useForm();

  const {
    data,
    isLoading,
    refetch: todoReFetch,
  } = useTodoQueries.useGetTodoDetail(id, todoId ?? "");
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
    useCalendarQueries.useGetCalendarProfile(
      id,
      data?.userId ? `userId=${data.userId}` : ""
    );

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
  const { mutate: editComment } = useMutation({
    mutationFn: useCommentMutations.updateComment,
  });

  const handleClickDeleteTodo = () => {
    if (sessionId === data?.userId) {
      setIsTodoModalOpen(true);
    } else {
      showAlert("본인의 일정만 삭제할 수 있습니다.", "error");
    }
  };

  const onCommentSubmit = (data: any) => {
    if (isCommentSubmit) return;
    setIsCommentSubmit(true);
    createComment(
      { calendarId: id, query, body: data },
      {
        onSuccess: () => {
          showAlert("댓글이 등록되었습니다.", "success");
          commentRefetch();
          refetch();
          commentReset();
          setIsCommentSubmit(false);
        },
        onError: () => {
          showAlert("댓글 등록에 실패했습니다.", "error");
          setIsCommentSubmit(false);
        },
      }
    );
  };

  const handleToggleLike = () => {
    toggleLike(query, {
      onSuccess: () => {
        refetch();
      },
      onError: () => {
        showAlert("좋아요 등록에 실패했습니다.", "error");
      },
    });
  };

  const handleClickDeleteComment = (comment: any) => {
    if (sessionId == comment.comment.userId) {
      deleteComment(
        { calendarId: id, commentId: comment.comment.id },
        {
          onSuccess: (result) => {
            if (result) {
              showAlert("댓글 삭제에 성공하였습니다.", "success");
            } else {
              showAlert("댓글 삭제에 실패하였습니다.", "error");
            }
            commentRefetch();
          },
          onError: () => {
            showAlert("댓글 삭제에 실패했습니다.", "error");
          },
        }
      );
    } else {
      showAlert("본인의 댓글만 삭제할 수 있습니다.", "error");
    }
  };

  const handleEditorMode = () => {
    if (sessionId === data?.userId) {
      setEditorMode(true);
    } else {
      showAlert("본인의 일정만 수정할 수 있습니다.", "error");
    }
  };
  const handleOpenComment = () => setOpenComment(!openComment);

  const handleDeleteTodo = () => {
    deleteTodo(
      { calendarId: id, todoId },
      {
        onSuccess: () => {
          showAlert("일정이 삭제되었습니다.", "success");
          setTodoDetailModalOpen(false);
          setCalendarDateModalOpen(true);
          router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);
        },
        onError: () => {
          showAlert("일정 삭제에 실패했습니다.", "error");
        },
      }
    );
  };

  const handleCancel = () => {
    setTodoDetailModalOpen(false);
    setCalendarDateModalOpen(true);
  };

  const handleEditClick = (comment: any) => {
    if (sessionId === comment.userId) {
      setEditingCommentId(comment.id);
      setActiveCommentId(null);
    } else {
      showAlert("본인의 댓글만 수정할 수 있습니다.", "error");
    }
  };

  const handleSettingComment = (comment: any) => {
    setActiveCommentId(
      activeCommentId === comment.comment.id ? null : comment.comment.id
    );
  };

  const onEditSubmit = (data: any) => {
    const formData = { content: data[`content_${editingCommentId}`] };
    editComment(
      { calendarId: id, commentId: editingCommentId, body: formData },
      {
        onSuccess: () => {
          showAlert("댓글이 수정되었습니다.", "success");
          commentRefetch();
          setEditingCommentId(null);
          editReset();
        },
        onError: () => {
          showAlert("댓글 수정에 실패했습니다.", "error");
        },
      }
    );
  };

  // const menuRef = useRef<HTMLDivElement>(null);
  // const buttonRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       menuRef.current &&
  //       buttonRef.current &&
  //       !menuRef.current.contains(event.target as Node) &&
  //       !buttonRef.current.contains(event.target as Node)
  //     ) {
  //       setActiveCommentId(null);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);
  //   return () => document.removeEventListener("mousedown", handleClickOutside);
  // }, []);

  return (
    <div className="lg:absolute w-[300px] lg:w-[550px] h-[600px] lg:h-[748px] bg_depp bor rounded-md shadow_box top-0 z-50 p-5 lg:p-[20px] lg:pb-[30px] flex flex-col lg:justify-between">
      {isLoading ||
      calendarProfileIsLoading ||
      likeIsLoading ||
      commentIsLoading ? (
        <div className="loading spinner " />
      ) : (
        <>
          <div>
            <div
              className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
              onClick={handleCancel}
            >
              <IconX className="w-full h-full" />
            </div>
            <h1 className="-mt-[10px] text_lg flex items-center space-x-[10px] noto-sans-text">
              <span>{Helper.formatDateForTodoDetail(data?.date)}</span>
              <span className="text_base mb-[3px]">|</span>
              <span>
                {Helper.formatTimeForTodoDetail(data?.startAt, data?.endAt)}
              </span>
            </h1>
            <div className="relative">
              <div className="flex items-center mt-[5px] lg:mt-[20px] space-x-[13px] ml-[5px] lg:ml-[15px]">
                <div className="w-[10px] h-[10px] rounded-full bg-[#494949]" />
                <p className="text-[25px] lg:text-[30px] dodum-text">
                  {data?.title}
                </p>
              </div>
              <div className="ml-[25px] lg:ml-[20px] mb-[10px] w-[240px] lg:w-[488px] break-all overflow-y-auto h-[100px] noto-sans-text whitespace-pre-wrap">
                <p className="text_lg lg:pl-[18px] py-[5px] pr-[5px] w-[240px] lg:w-[468px]">
                  {data?.content}
                </p>
              </div>
              <div className="border-l absolute left-[10px] top-[30px] h-[128px] w-[1px]" />
              <div className="flex items-center justify-between mt-[5px] px-[3px] lg:px-[10px] noto-sans-text">
                <div className="flex items-center">
                  <img
                    src={
                      calendarProfile?.img == "" || calendarProfile?.img == null
                        ? process.env.NEXT_PUBLIC_PROFILE_IMG
                        : calendarProfile?.img
                    }
                    className="w-[20px] h-[20px] rounded-full bor object-cover"
                  />
                  <p className="text-[13px] lg:text-[20px] ml-[8px] mr-[12px]">
                    {calendarProfile?.name ?? "탈퇴한 유저"}
                  </p>
                  <p className="text_base opacity-50 flex-wrap w-[100px] lg:w-[220px]">
                    {Helper.formatDateForComment(data?.createdAt)} 등록
                  </p>
                </div>
                <div className="flex items-center space-x-[2px] lg:space-x-[4px] text_base">
                  <button
                    onClick={handleEditorMode}
                    className="btn_transparent_sm"
                  >
                    수정
                  </button>
                  <button
                    onClick={handleClickDeleteTodo}
                    className="btn_transparent_sm"
                  >
                    삭제
                  </button>
                  {/* <button className="rounded w-[40px] h-[25px] bor">공유</button> */}
                </div>
              </div>
            </div>
          </div>
          <div className="noto-sans-text">
            <div className="px-[5px] lg:px-[10px]">
              <div className="flex items-center space-x-[10px] lg:space-x-[23px] py-[10px] lg:py-[15px] border-t mt-2 lg:mt-0">
                <div className="flex items-center space-x-[4.7px]">
                  {likeData?.is_liked ? (
                    <IconHeart
                      onClick={handleToggleLike}
                      className="w-[15px] h-[15px] lg:w-[19.65px] lg:h-[17.65px] cur"
                    />
                  ) : (
                    <IconHeartEmpty
                      onClick={handleToggleLike}
                      className="w-[15px] h-[15px] lg:w-[19.65px] lg:h-[17.65px] cur"
                    />
                  )}
                  <div>{likeData?.likes_count}</div>
                </div>
                <div className="flex items-center space-x-[7px]">
                  <IconComment
                    onClick={handleOpenComment}
                    className="w-[15px] h-[15px] lg:w-[17.65px] lg:h-[17.65px]"
                  />
                  <div>{commentData ? commentData.length : "0"}</div>
                </div>
              </div>
            </div>
            <div className="mt-[5px] lg:mt-[12px] space-y-[10px] lg:space-y-[26px] text_base px-[5px] lg:px-[10px] overflow-y-auto h-[200px] lg:h-[300px]">
              {commentData?.map((comment: any) => {
                return (
                  <div
                    key={comment.comment.id}
                    className="flex justify-between items-start relative"
                  >
                    <div className="flex items-start space-x-[10px] lg:space-x-[15px]">
                      <img
                        className="w-[30px] h-[30px] lg:w-[45px] lg:h-[45px] rounded-full bor object-cover"
                        src={
                          comment?.profile?.img == "" ||
                          comment?.profile?.img == null
                            ? process.env.NEXT_PUBLIC_PROFILE_IMG
                            : comment?.profile?.img
                        }
                      />
                      {editingCommentId === comment.comment.id ? (
                        <form
                          className="w-[220px] lg:w-[432px] h-[74px] flex flex-col items-center rounded-md bor bg-white"
                          onSubmit={editHandleSubmit(onEditSubmit)}
                        >
                          <input
                            className="w-full h-[37px] px-[10px] border-b  rounded-t-md outline-none"
                            type="text"
                            {...editRegister(`content_${comment.comment.id}`, {
                              value: comment.comment.content,
                            })}
                          />
                          <div className="w-full h-[37px] flex items-center justify-end px-[10px] space-x-[4px]">
                            <button
                              onClick={() => setEditingCommentId(null)}
                              type="button"
                              className="w-[40px] h-[25px] rounded-md bor btn_while"
                            >
                              취소
                            </button>
                            <button
                              type="submit"
                              className="w-[40px] h-[25px] rounded-md bor btn_while"
                            >
                              등록
                            </button>
                          </div>
                        </form>
                      ) : (
                        <div className="space-y-[5px]">
                          <div className="flex items-center space-x-[10px]">
                            <h1 className="font-bold">
                              {comment?.profile?.name}
                            </h1>
                            <p className="opacity-50">
                              {Helper.formatDateForComment(
                                comment?.comment?.createdAt
                              )}
                            </p>
                          </div>
                          <p className="w-[180px] lg:w-[390px]">
                            {comment.comment.content}
                          </p>
                        </div>
                      )}
                    </div>
                    {/* <img
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
              /> */}
                    {editingCommentId === comment.comment.id ? null : (
                      <>
                        <div
                          className=" relative w-[30px] h-[30px] rounded-full flex items-center justify-center hover:bg-[#49494910] cur "
                          onClick={() => handleSettingComment(comment)}
                        >
                          <IconEdit className="w-[6px] h-[18px]" />
                          <div
                            ref={(el) => {
                              menuRefs.current[comment.comment.id] = el;
                            }}
                            className={`absolute right-[34px] top-0 w-[55px] h-[60px] bor bg-white flex flex-col items-center justify-center  text_base rounded-md shadow_box z-99 ${
                              activeCommentId === comment.comment.id
                                ? ""
                                : "hidden"
                            }`}
                          >
                            <button
                              onClick={() => handleEditClick(comment.comment)}
                              type="button"
                              className="w-[55px] h-[50%] border-b "
                            >
                              수정
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClickDeleteComment(comment);
                              }}
                              className="w-[55px] h-[50%]"
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
            <form
              onSubmit={commentHandleSubmit(onCommentSubmit)}
              className="mt-[10px] lg:mt-[35px] flex items-center space-x-[10px] px-[10px]"
            >
              <input
                className="w-[250px] lg:w-[420px] h-[35px] rounded-md px-[10px] bor text_base focus:outline-none"
                placeholder="댓글을 남겨보세요."
                {...commentRegister("content")}
              />
              <button
                type="submit"
                className="w-[50px] lg:w-[60px] h-[35px] rounded-md bor text_lg btn_hilight"
              >
                등록
              </button>
            </form>
          </div>
        </>
      )}
      <ModalWrapper isOpen={isTodoModalOpen} setIsOpen={setIsTodoModalOpen}>
        <DeleteModal
          setIsOpen={setIsTodoModalOpen}
          mutateFn={handleDeleteTodo}
          title="정말 일정을 삭제하시겠습니까?"
          msg="삭제하시면 일정에 대한 모든 정보가 삭제됩니다."
        />
      </ModalWrapper>
    </div>
  );
};

export default TodoViewMode;
