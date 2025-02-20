import useSearch from "@/hooks/useSearch";
import useCommentMutations from "@/queries/comment/useCommentMutations";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeMutations from "@/queries/like/useLikeMutations";
import useLikeQueries from "@/queries/like/useLikeQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "@/components/modal/ModalWrapper";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import DeleteModal from "@/components/modal/DeleteModal";
import { useRouter } from "next/navigation";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import parse from "html-react-parser";
import {
  IconComment,
  IconEdit,
  IconHeart,
  IconHeartEmpty,
  IconNextGray,
} from "@/icons";
import { useAlert } from "@/components/alert/AlertContext";
import useUserQueries from "@/queries/user/useUserQueries";

const DiaryViewMode = ({ setEditorMode, editorMode }: any) => {
  const router = useRouter();
  const [isCommentSubmit, setIsCommentSubmit] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [openComment, setOpenComment] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState<string | null>(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const diaryId = useSearch.useSearchDiaryId();
  const query = `contentType=diary&contentId=${diaryId}`;

  const menuRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const { showAlert } = useAlert();
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
    refetch: diaryRefetch,
  } = useDiaryQueries.useGetDiaryDetail(id, diaryId);
  const { data: userData } = useCalendarQueries.useGetCalendarUserInfo(id);
  const { data: user } = useUserQueries.useGetUser();
  const { data: calendarData } = useCalendarQueries.useGetCalendarBasic(id);
  const options = {
    replace: (node: any) => {
      if (node.type === "tag" && node.name === "img") {
        return <img {...node.attribs} className="max-w-[870px]" />;
      }
    },
  };
  const diaryContent = parse(data ? data?.content : "", options);

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
  const { mutate: deleteDiary } = useMutation({
    mutationFn: useDiaryMutations.deleteDiary,
  });
  const { mutate: deleteComment } = useMutation({
    mutationFn: useCommentMutations.deleteComment,
  });
  const { mutate: editComment } = useMutation({
    mutationFn: useCommentMutations.updateComment,
  });

  const handleClickdeleteDiary = () => {
    if (user?.id === data?.userId) {
      setIsDiaryModalOpen(true);
    } else {
      showAlert("본인의 일기만 삭제할 수 있습니다.", "error");
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
          refetch();
          commentRefetch();
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

  const handleEditorMode = () => {
    if (user?.id === data?.userId) {
      setEditorMode(!editorMode);
    } else {
      showAlert("본인의 일기만 수정할 수 있습니다.", "error");
    }
  };
  const handleOpenComment = () => setOpenComment(!openComment);

  const handleDeleteComment = (comment: any) => {
    if (user?.id === comment.comment.userId) {
      deleteComment(
        { calendarId: id, commentId: comment.comment.id },
        {
          onSuccess: (result) => {
            if (result) {
              showAlert("댓글 삭제에 성공하였습니다.", "success");
              commentRefetch();
              setEditingCommentId(null);
              editReset();
            } else {
              showAlert("댓글 삭제에 실패하였습니다.", "error");
            }
          },
          onError: () => {
            showAlert("댓글 삭제에 실패하였습니다.", "error");
          },
        }
      );
    } else {
      showAlert("본인의 댓글만 삭제할 수 있습니다.", "error");
    }
  };

  const handleClickCalendar = () =>
    router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);

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

  const handledeleteDiary = () => {
    deleteDiary(
      { calendarId: id, diaryId },
      {
        onSuccess: () => {
          router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);
          showAlert("일기가 삭제되었습니다.", "success");
        },
        onError: () => {
          showAlert("일기 삭제에 실패했습니다.", "error");
        },
      }
    );
  };

  const handleEditClick = (comment: any) => {
    if (user?.id === comment.userId) {
      setEditingCommentId(comment.id);
      setActiveCommentId(null);
    } else {
      showAlert("본인의 댓글만 수정할 수 있습니다.", "error");
    }
  };

  return (
    <div className="w-[300px] lg:min-w-[600px] lg:mt-[86px] lg:w-[870px] noto-sans-text py-[10px] lg:py-[0px]">
      <div
        className="flex items-center space-x-[10px] cur"
        onClick={handleClickCalendar}
      >
        <p className="opacity-50 text-lg">{calendarData?.name}</p>
        <IconNextGray className="w-[5px] h-[10px]" />
      </div>
      <div className="flex justify-between items-center -mt-[5px]">
        <h2 className="text-[25px] lg:text-[30px] dodum-text">{data?.title}</h2>
      </div>
      <div className="flex items-center mt-3 justify-between">
        <div className="flex items-center">
          <img
            className="w-[20px] h-[20px] rounded-full bor mr-[8px] object-cover"
            src={
              calendarProfile?.img == "" || calendarProfile?.img == null
                ? process.env.NEXT_PUBLIC_PROFILE_IMG
                : calendarProfile?.img
            }
          />
          <h1 className="text-lg mr-[10px]">
            {calendarProfile?.name ?? "탈퇴한 유저"}
          </h1>
          <p className="text-base text-[#969696]">
            {Helper.formatDateForContent(data?.createdAt)} 등록
          </p>
        </div>
        <div className="flex space-x-2">
          <button onClick={handleEditorMode} className="btn_transparent_sm">
            수정
          </button>
          <button
            type="button"
            onClick={handleClickdeleteDiary}
            className="btn_transparent_sm"
          >
            삭제
          </button>
          {/* <button className="rounded w-15 h-10 bor">공유</button> */}
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-[10px] lg:mt-[26px] whitespace-pre-wrap">
        <div className="max-h-[700px] overflow-auto whitespace-pre-wrap">
          <div className="text-lg [&_img]:max-w-[300px] lg:[&_img]:max-w-none [&_img]:w-full [&_img]:h-auto">
            {diaryContent}
          </div>
        </div>
      </div>
      <div className="flex border-t space-x-4 mt-[30px] lg:mt-[75px]">
        <div className="flex items-center space-x-6 mt-[10px]">
          <div className="flex items-center space-x-2  ">
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
          <div className="flex items-center space-x-2">
            <IconComment
              onClick={handleOpenComment}
              className="w-[15px] h-[15px] lg:w-5 lg:h-5 cur"
            />
            <div>{commentData ? commentData.length : "0"}</div>
          </div>
        </div>
      </div>
      {openComment && (
        <div className="mt-[13px]">
          <div className="space-y-3">
            {commentData?.map((comment: any) => {
              return (
                <div
                  key={comment.comment.id}
                  className="flex justify-between items-start relative"
                >
                  <div className="flex items-start space-x-[10px] space-y-2">
                    <img
                      className={`w-[25px] h-[25px] lg:w-[45px] lg:h-[45px] mt-[10px] rounded-full object-cover ${
                        comment?.profile?.id === 0 ? "" : "bor"
                      }`}
                      src={
                        comment?.profile?.img == "" ||
                        comment?.profile?.img == null
                          ? process.env.NEXT_PUBLIC_PROFILE_IMG
                          : comment?.profile?.img
                      }
                    />
                    <div className=" space-y-[2px] ">
                      {editingCommentId === comment.comment.id ? (
                        <form
                          className="w-[250px] lg:w-[818px] h-[74px] flex flex-col items-center rounded-md bor bg-white"
                          onSubmit={editHandleSubmit(onEditSubmit)}
                        >
                          <textarea
                            className="w-full h-[37px] px-[10px] border-b  rounded-t-md outline-none resize-none"
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
                        <div className="space-y-[5px] whitespace-pre-wrap">
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
                          <p className="w-[240px] lg:w-[700px]">
                            {comment.comment.content}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {editingCommentId === comment.comment.id ? null : (
                    <>
                      <div
                        className="w-[30px] h-[30px] rounded-full flex items-center justify-center hover:bg-[#49494910] cur mt-[17px]"
                        onClick={() => handleSettingComment(comment)}
                      >
                        <IconEdit className="w-[6px] h-[18px] " />
                      </div>
                      <div
                        ref={(el) => {
                          menuRefs.current[comment.comment.id] = el;
                        }}
                        className={`absolute right-[-59px] w-[55px] top-[17px] h-[60px] bor bg-white flex flex-col items-center justify-center  text-base rounded-md shadow_box z-99 ${
                          activeCommentId === comment.comment.id ? "" : "hidden"
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
                            handleDeleteComment(comment);
                          }}
                          className="w-[55px] h-[50%]"
                        >
                          삭제
                        </button>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <form
            onSubmit={commentHandleSubmit(onCommentSubmit)}
            className="flex items-center mt-8 space-x-2"
          >
            <div className="bor w-full h-[140px] lg:h-[162px] rounded pt-[15px] bg-white flex flex-col space-y-[10px] justify-between">
              <div>
                <div className="flex items-center space-x-[8px] px-[18px]">
                  <img
                    className="w-[20px] h-[20px] rounded-full bor object-cover"
                    src={
                      userData?.img == "" || userData?.img == null
                        ? process.env.NEXT_PUBLIC_PROFILE_IMG
                        : userData?.img
                    }
                  />
                  <h1 className="text-base">{userData?.name}</h1>
                </div>
                <div className="pr-1">
                  <textarea
                    {...commentRegister("content", {
                      required: "내용을 입력해 주세요.",
                    })}
                    className="w-full px-[18px] h-[40px] lg:h-[64px] mt-[5px] outline-none rounded bg-transparent text-base placeholder:opacity-50 focus:outline-none resize-none"
                    placeholder="댓글을 남겨보세요."
                  />
                </div>
              </div>
              <div className="flex items-center justify-end space-x-[4px] h-[37px] border-t px-[10px]">
                <button
                  onClick={() => commentReset()}
                  type="button"
                  className="w-[40px] bor h-[25px] rounded ml-auto btn_while"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="w-[40px] bor h-[25px] rounded ml-auto btn_while"
                >
                  등록
                </button>
              </div>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isDiaryModalOpen} setIsOpen={setIsDiaryModalOpen}>
        <DeleteModal
          setIsOpen={setIsDiaryModalOpen}
          mutateFn={handledeleteDiary}
          title="정말 일기를 삭제하시겠습니까?"
          msg="삭제하시면 일기에 대한 모든 내용이 삭제됩니다."
        />
      </ModalWrapper>
    </div>
  );
};

export default DiaryViewMode;
