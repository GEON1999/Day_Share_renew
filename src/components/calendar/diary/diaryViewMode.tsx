import useSearch from "@/hooks/useSearch";
import useCommentMutations from "@/queries/comment/useCommentMutations";
import useCommentQueries from "@/queries/comment/useCommentQueries";
import useLikeMutations from "@/queries/like/useLikeMutations";
import useLikeQueries from "@/queries/like/useLikeQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import ModalWrapper from "@/components/modal/ModalWrapper";
import EditCommentModal from "@/components/modal/EditCommentModal";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import Helper from "@/helper/Helper";
import DeleteModal from "@/components/modal/DeleteModal";
import { useRouter } from "next/navigation";
import useDiaryQueries from "@/queries/diary/useDiaryQueries";
import useDiaryMutations from "@/queries/diary/useDiaryMutations";
import parse from "html-react-parser";
import { debounce } from "lodash";
import StaticKeys from "@/keys/StaticKeys";

const DiaryViewMode = ({ setEditorMode, editorMode }: any) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDiaryModalOpen, setIsDiaryModalOpen] = useState(false);
  const [currentCommentId, setCurrentCommentId] = useState("");
  const [currentEditCommentData, setCurrentEditCommentData] = useState(null);
  const [openComment, setOpenComment] = useState(true);
  const id = useSearch.useSearchId();
  const diaryId = useSearch.useSearchDiaryId();
  const query = `contentType=diary&contentId=${diaryId}`;

  const { register: commentRegister, handleSubmit: commentHandleSubmit } =
    useForm();

  const {
    data,
    isLoading,
    refetch: diaryRefetch,
  } = useDiaryQueries.useGetDiaryDetail(id, diaryId);
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

  const handleClickdeleteDiary = () => setIsDiaryModalOpen(true);

  const onCommentSubmit = debounce((data: any) => {
    createComment(
      { calendarId: id, query, body: data },
      {
        onSuccess: () => {
          refetch();
          console.log("success");
          commentRefetch();
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
  return (
    <div className="min-w-[600px] px-20 mt-10">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <img
            className="w-10 h-10 rounded-full bor"
            src={calendarProfile?.img ?? process.env.NEXT_PUBLIC_LOGO}
          />
          <h1 className="font-bold text-xl ml-2">
            {calendarProfile?.name ?? "탈퇴한 유저"}
          </h1>
        </div>
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={handleClickdeleteDiary}
            className="bg_deeper rounded px-4 py-2 bor"
          >
            삭제
          </button>
          <button
            onClick={handleEditorMode}
            className="bg_deeper rounded px-4 py-2 bor"
          >
            수정
          </button>
        </div>
      </div>
      <div className="flex flex-col space-y-2 mt-4">
        <h2 className="text-xl font-bold text-center">{data?.title}</h2>
        <div className="flex justify-center max-h-[500px] overflow-auto">
          <div>{diaryContent}</div>
        </div>
      </div>
      <div className="flex border-t-2 border-b-2 py-4 my-4 space-x-4">
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
          <div>{commentData ? commentData.length : "0"}</div>
        </div>
        <div className=""> - {Helper.formatDate(data?.createdAt)} - </div>
      </div>
      {openComment && (
        <div>
          <h1 className="font-bold text-xl mb-5">댓글</h1>
          <div className="max-h-[180px] overflow-y-auto">
            {commentData?.map((comment: any) => (
              <div
                key={comment.comment.id}
                className="flex justify-between items-center"
              >
                <div className="flex items-center space-x-3 space-y-2">
                  <img
                    className="w-10 h-10 rounded-full bor"
                    src={comment?.profile?.img ?? ""}
                  />
                  <div className="max-w-[1000px]">
                    <h1 className="font-bold">{comment?.profile?.name}</h1>
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
            className="flex items-center mt-5 space-x-2"
          >
            <input
              {...commentRegister("content")}
              className="border-2 border-gray-400 w-full h-10 px-4 outline-none rounded"
              placeholder="댓글을 입력해주세요"
            />
            <button type="submit" className="w-20 bg_deeper bor h-10 rounded">
              저장
            </button>
          </form>
        </div>
      )}
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
