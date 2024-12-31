import useSearch from "@/hooks/useSearch";
import useCommentMutations from "@/queries/comment/useCommentMutations";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeMutations from "@/queries/like/useLikeMutations";
import useLikeQueries from "@/queries/like/useLikeQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "@/components/modal/ModalWrapper";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import DeleteModal from "@/components/modal/DeleteModal";
import { useRouter } from "next/navigation";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import parse from "html-react-parser";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";
import { IconComment, IconEdit, IconHeart, IconNextGray } from "@/icons";

const DiaryViewMode = ({ setEditorMode, editorMode }: any) => {
  const router = useRouter();
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [openComment, setOpenComment] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);

  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const diaryId = useSearch.useSearchDiaryId();
  const query = `contentType=diary&contentId=${diaryId}`;

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
  const { data: calendarData } = useCalendarQueries.useGetCalendarBasic(id);
  const options = {
    replace: (node: any) => {
      if (node.type === "tag" && node.name === "img") {
        return (
          <img
            {...node.attribs}
            className="max-w-[800px] max-h-[800px] rounded-lg"
          />
        );
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

  const handleClickdeleteDiary = () => setIsDiaryModalOpen(true);

  const onCommentSubmit = debounce((data: any) => {
    createComment(
      { calendarId: id, query, body: data },
      {
        onSuccess: () => {
          refetch();
          console.log("success");
          commentRefetch();
          commentReset();
        },
        onError: () => {
          console.log("error");
        },
      }
    );
    console.log(data);
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

  const handleEditorMode = () => setEditorMode(!editorMode);
  const handleOpenComment = () => setOpenComment(!openComment);

  const handleDeleteComment = () => {
    deleteComment(
      { calendarId: id, commentId: activeCommentId },
      {
        onSuccess: (result) => {
          if (result) {
            alert("댓글 삭제에 성공하였습니다.");
            commentRefetch();
            setEditingCommentId(null);
            editReset();
          } else {
            alert("댓글 삭제에 실패하였습니다.");
          }
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleClickCalendar = () => router.push(`/calendar/${id}?date=${date}`);

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

  const handledeleteDiary = () => {
    deleteDiary(
      { calendarId: id, diaryId },
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

  const handleEditClick = (comment: any) => {
    console.log("edit click", comment);
    setEditingCommentId(comment.id);
    setActiveCommentId(null);
  };

  return (
    <div className="min-w-[600px] mt-[86px] w-[870px] noto-sans-text">
      <div
        className="flex items-center space-x-[10px] cur"
        onClick={handleClickCalendar}
      >
        <p className="opacity-50 text-[20px]">{calendarData?.name}</p>
        <IconNextGray className="w-[5px] h-[10px]" />
      </div>
      <div className="flex justify-between items-center mt-3">
        <h2 className="text-[30px] dodum-text">{data?.title}</h2>
      </div>
      <div className="flex items-center mt-3 justify-between">
        <div className="flex items-center">
          <img
            className="w-[20px] h-[20px] rounded-full bor mr-[8px]"
            src={calendarProfile?.img ?? process.env.NEXT_PUBLIC_LOGO}
          />
          <h1 className="text-[20px] mr-[10px]">
            {calendarProfile?.name ?? "탈퇴한 유저"}
          </h1>
          <p className="text-[15px] text-[#969696]">
            {Helper.formatDateForContent(data?.createdAt)} 등록
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handleEditorMode}
            className="rounded w-[40px] h-[25px] bor text-[15px]"
          >
            수정
          </button>
          <button
            type="button"
            onClick={handleClickdeleteDiary}
            className="rounded w-[40px] h-[25px] bor text-[15px]"
          >
            삭제
          </button>
          {/* <button className="rounded w-15 h-10 bor">공유</button> */}
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-[26px]">
        <div className="max-h-[700px] overflow-auto">
          <div>{diaryContent}</div>
        </div>
      </div>
      <div className="flex border-t space-x-4 mt-[75px]">
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
          <div className="space-y-3">
            {commentData?.map((comment: any) => (
              <div
                key={comment.comment.id}
                className="flex justify-between items-center relative"
              >
                <div className="flex items-center space-x-[10px] space-y-2">
                  <img
                    className="w-[45px] h-[45px] rounded-full bor"
                    src={comment?.profile?.img ?? ""}
                  />
                  <div className=" space-y-[2px]">
                    {editingCommentId === comment.comment.id ? (
                      <form
                        className="w-[818px] h-[74px] flex flex-col items-center rounded-md bor bg-white"
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
                          <h1 className="font-bold">
                            {comment?.profile?.name}
                          </h1>
                          <p className="opacity-50">
                            {Helper.formatDateForComment(
                              comment?.comment?.createdAt
                            )}
                          </p>
                        </div>
                        <p className="w-[700px]">{comment.comment.content}</p>
                      </div>
                    )}
                  </div>
                </div>
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
                          handleDeleteComment();
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
                className="w-full outline-none rounded bg-transparent text-[20px] placeholder:opacity-50 px-[1px]"
                placeholder="댓글을 남겨보세요."
              />
              <button
                type="submit"
                className="w-[46px] bor h-[30px] rounded ml-auto"
              >
                등록
              </button>
            </div>
          </form>
        </div>
      )}
      <ModalWrapper isOpen={isDiaryModalOpen} setIsOpen={setIsDiaryModalOpen}>
        <DeleteModal
          setIsOpen={setIsDiaryModalOpen}
          mutateFn={handledeleteDiary}
          msg="정말 해당 기록을 삭제하시겠습니까?"
        />
      </ModalWrapper>
    </div>
  );
};

export default DiaryViewMode;
