import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import DeleteModal from "@/components/modal/DeleteModal";
import CalendarUserPagination from "@/components/pagination/calendarUserPagination";
import { emotionData } from "@/components/main/statusSection";
import { useAlert } from "@/components/alert/AlertContext";

const SideUserList = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const id = useSearch.useSearchId();
  const currentUserPage = useSearch.useSearchUserPage();
  const [deleteUserId, setDeleteUserId] = useState<null | Number>(null);
  const { showAlert } = useAlert();

  const { data: userList, isLoading: userListLoading } =
    useCalendarQueries.useGetCalendarPermissionList(
      id,
      `user_page=${currentUserPage}`
    );

  const { mutate: deleteCalendarPermission } = useMutation({
    mutationFn: useCalendarMutations.deleteCalendarPermission,
  });

  const handleDeletePermission = () => {
    deleteCalendarPermission(
      { calendarId: id, userId: deleteUserId },
      {
        onSuccess: (result) => {
          if (result) {
            showAlert("유저 추방에 성공하였습니다.", "success");
          } else {
            showAlert("유저 추방에 실패하였습니다.", "error");
          }
          window.location.reload();
        },
        onError: () => {
          showAlert("유저 추방에 실패하였습니다.", "error");
        },
      }
    );
  };

  const handleClickDeletePermission = (userId: number) => {
    setIsConfirmOpen(true);
    setDeleteUserId(userId);
  };

  return (
    <section className="mt-[28px] side_user_container">
      <div>
        <div className="flex items-center justify-between mb-[10px] mt-[4px] px-[18px]">
          <h1 className={`text-[20px]`}>참여</h1>
          <p className="text-[15px] noto-sans-text text-[#2D2D2E50]">
            {userList?.total_users}/000
          </p>
        </div>
        <div className="flex justify-center items-center flex-col">
          {userList?.permissions?.map((user: any) => {
            console.log(user);
            return (
              <div
                key={user.id}
                className="flex items-center justify-between my-[8px] w-[194px] h-[35px] rounded-full group hover:bg-[#00000010] pl-[9px] pr-[6px] "
              >
                <div className="flex items-center">
                  <img
                    className="w-[25px] h-[25px] rounded-full bor object-cover"
                    src={
                      user.img === ""
                        ? process.env.NEXT_PUBLIC_PROFILE_IMG
                        : user.img
                    }
                  />
                  <span className="ml-2 text-[15px] noto-sans-text text-[#2D2D2E]">
                    {user.name}
                  </span>
                  {user?.emotion === "EMPTY" ? null : (
                    <img
                      src={
                        emotionData.find(
                          (emotion) => emotion.id === user.emotion
                        )?.imgSrc
                      }
                      alt="emotion"
                      className="w-[20px] h-[20px] ml-[7px]"
                    />
                  )}
                </div>
                <button
                  onClick={() => {
                    handleClickDeletePermission(user.userId);
                  }}
                  className="border-[0.8px] border-[#49494950] rounded-full w-[38px] h-[20px] text-[12px] noto-sans-text text-[#2D2D2E] hidden group-hover:block"
                >
                  추방
                </button>
              </div>
            );
          })}
        </div>
        <ModalWrapper setIsOpen={setIsConfirmOpen} isOpen={isConfirmOpen}>
          <DeleteModal
            setIsOpen={setIsConfirmOpen}
            mutateFn={handleDeletePermission}
            title="정말 해당 유저를 추방하시겠습니까?"
            msg="추방하시면 해당 유저는 더이상 달력에 접근할 수 없습니다."
          />
        </ModalWrapper>
      </div>
      <div className="mx-auto">
        <CalendarUserPagination total_count={userList?.total_users} />
      </div>
    </section>
  );
};

export default SideUserList;
