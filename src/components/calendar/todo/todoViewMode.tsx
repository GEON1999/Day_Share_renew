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
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import DeleteModal from "@/components/modal/DeleteModal";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";
import { IconComment, IconEdit, IconHeart, IconX } from "@/icons";

const TodoViewMode = ({ setEditorMode, setIsDetailOpen }: any) => {
  const router = useRouter();
  const [isTodoModalOpen, setIsTodoModalOpen] = useState(false);
  const [openComment, setOpenComment] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const id = useSearch.useSearchId();
  const todoId = useSearch.useSearchQueryTodoId();
  const query = `contentType=todo&contentId=${todoId}`;

  const { register: commentRegister, handleSubmit: commentHandleSubmit } =
    useForm();

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
    useCalendarQueries.useGetCalendarProfile(id, `userId=${data?.userId}`);

  const { data: userData } = useCalendarQueries.useGetCalendarUserInfo(id);

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

  const handleClickDeleteTodo = () => setIsTodoModalOpen(true);
  const onCommentSubmit = debounce((data: any) => {
    createComment({ calendarId: id, query, body: data }),
      {
        onSuccess: () => {
          refetch();
          commentRefetch();
        },
        onError: () => {},
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

  const handleClickDeleteComment = () => {
    if (userData?.userId === activeCommentId) {
      deleteComment(
        { calendarId: id, commentId: activeCommentId },
        {
          onSuccess: (result) => {
            if (result) {
              alert("댓글 삭제에 성공하였습니다.");
            } else {
              alert("댓글 삭제에 실패하였습니다.");
            }
            commentRefetch();
          },
          onError: () => {
            console.log("실패");
          },
        }
      );
    } else {
      alert("본인의 댓글만 삭제할 수 있습니다.");
    }
  };

  const handleEditorMode = () => setEditorMode(true);
  const handleOpenComment = () => setOpenComment(!openComment);

  const handleDeleteTodo = () => {
    deleteTodo(
      { calendarId: id, todoId },
      {
        onSuccess: () => {
          setIsDetailOpen(false);
          router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);
        },
        onError: () => {
          console.log("error");
        },
      }
    );
  };

  const handleCancel = () => {
    setIsDetailOpen(false);
  };

  const handleEditClick = (comment: any) => {
    if (userData?.userId === comment.userId) {
      setEditingCommentId(comment.id);
      setActiveCommentId(null);
    } else {
      alert("본인의 댓글만 수정할 수 있습니다.");
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
          commentRefetch();
          setEditingCommentId(null);
          editReset();
        },
        onError: () => {
          console.log("실패");
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
    <div className="absolute w-[550px] h-[737px] bg_depp bor rounded-md shadow_box top-0 z-50 p-[20px] text-[#494949] noto-sans-text overflow-y-auto overflow-x-visible">
      {isLoading ? (
        <div className="loading spinner " />
      ) : (
        <>
          <div
            className="w-[10px] h-[10px] ml-auto cur flex items-center justify-center"
            onClick={handleCancel}
          >
            <IconX className="w-full h-full" />
          </div>
          <h1 className="-mt-[10px] text-[20px] flex items-center space-x-[10px]">
            <span>{Helper.formatDateForTodoDetail(data?.date)}</span>
            <span className="text-[15px]">|</span>
            <span>
              {Helper.formatTimeForTodoDetail(data?.startAt, data?.endAt)}
            </span>
          </h1>
          <div className="flex items-center mt-[20px] space-x-[13px] ml-[15px]">
            <div className="w-[10px] h-[10px] rounded-full bg-[#494949]" />
            <p className="text-[30px] dodum-text">{data?.title}</p>
          </div>
          <div className="ml-[20px] -mt-[10px] border-l py-[28px] pl-[18px] w-[440px]">
            <p className="text-[20px]">{data?.content}</p>
          </div>
          <div className="flex items-center justify-between mt-[5px] px-[10px]">
            <div className="flex items-center">
              <img
                src={calendarProfile?.img ?? process.env.NEXT_PUBLIC_LOGO}
                className="w-[20px] h-[20px] rounded-full bor"
              />
              <p className="text-[20px] ml-[8px] mr-[12px]">
                {calendarProfile?.name ?? "탈퇴한 유저"}
              </p>
              <p className="text-[15px] opacity-50">
                {Helper.formatDateForComment(data?.createdAt)} 등록
              </p>
            </div>
            <div className="flex items-center space-x-[4px] text-[15px]">
              <button
                onClick={handleEditorMode}
                className="rounded w-[40px] h-[25px] bor"
              >
                수정
              </button>
              <button
                onClick={handleClickDeleteTodo}
                className="rounded w-[40px] h-[25px] bor"
              >
                삭제
              </button>
              {/* <button className="rounded w-[40px] h-[25px] bor">공유</button> */}
            </div>
          </div>
          <div className="px-[10px]">
            <div className="flex items-center space-x-[23px] mt-[15px] py-[15px]  border-t border-[#494949]">
              <div className="flex items-center space-x-[4.7px]">
                <IconHeart
                  onClick={handleToggleLike}
                  className="w-[17.65px] h-[17.65px] cur"
                />
                <div>{likeData}</div>
              </div>
              <div className="flex items-center space-x-[7px]">
                <IconComment
                  onClick={handleOpenComment}
                  className="w-[17.65px] h-[17.65px]"
                />
                <div>{commentData ? commentData.length : "0"}</div>
              </div>
            </div>
          </div>
          <div className="mt-[5px] space-y-[26px] text-[15px] px-[10px]">
            {commentData?.map((comment: any) => (
              <div
                key={comment.comment.id}
                className="flex justify-between items-center relative"
              >
                <div className="flex items-start space-x-[15px]">
                  <img
                    className="w-[45px] h-[45px] rounded-full bor"
                    src={comment?.profile?.img ?? ""}
                  />
                  {editingCommentId === comment.comment.id ? (
                    <form
                      className="w-[432px] h-[74px] flex flex-col items-center rounded-md bor bg-white"
                      onSubmit={editHandleSubmit(onEditSubmit)}
                    >
                      <input
                        className="w-full h-[37px] px-[10px] border-b border-[#494949] rounded-t-md outline-none"
                        type="text"
                        {...editRegister(`content_${comment.comment.id}`, {
                          value: comment.comment.content,
                        })}
                      />
                      <div className="w-full h-[37px] flex items-center justify-end px-[10px] space-x-[10px]">
                        <button
                          onClick={() => setEditingCommentId(null)}
                          type="button"
                          className="w-[40px] h-[25px] rounded-md bor"
                        >
                          취소
                        </button>
                        <button
                          type="submit"
                          className="w-[40px] h-[25px] rounded-md bor"
                        >
                          등록
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-[5px]">
                      <div className="flex items-center space-x-[10px]">
                        <h1 className="font-bold">{comment?.profile?.name}</h1>
                        <p className="opacity-50">
                          {Helper.formatDateForComment(
                            comment?.comment?.createdAt
                          )}
                        </p>
                      </div>
                      <p>{comment.comment.content}</p>
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
                      className="w-[30px] h-[30px] rounded-full flex items-center justify-center hover:bg-[#49494910] cur "
                      onClick={() => handleSettingComment(comment)}
                    >
                      <IconEdit className="w-[6px] h-[18px]" />
                    </div>
                    <div
                      className={`absolute right-[-51px] top-[10px] w-[55px] h-[60px] bor bg-white flex flex-col items-center justify-center border-[#494949] text-[15px] rounded-md shadow_box z-99 ${
                        activeCommentId === comment.comment.id ? "" : "hidden"
                      }`}
                    >
                      <button
                        onClick={() => handleEditClick(comment.comment)}
                        type="button"
                        className="w-[55px] h-[50%] border-b border-[#494949]"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClickDeleteComment();
                        }}
                        className="w-[55px] h-[50%]"
                      >
                        삭제
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <form
            onSubmit={commentHandleSubmit(onCommentSubmit)}
            className="mt-[35px] flex items-center space-x-[10px] px-[10px]"
          >
            <input
              className="w-[420px] h-[35px] rounded-md px-[10px] bor text-[15px]"
              placeholder="댓글을 남겨보세요."
              {...commentRegister("content")}
            />
            <button
              type="submit"
              className="w-[60px] h-[35px] rounded-md bor text-[20px] bg_hilight_2"
            >
              등록
            </button>
          </form>
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
