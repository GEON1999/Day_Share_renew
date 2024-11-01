import useSearch from "@/hooks/useSearch";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import ModalWrapper from "@/components/modal/ModalWrapper";
import useCalendarMutations from "@/queries/calendar/useCalendarMutations";
import DeleteModal from "@/components/modal/DeleteModal";

const SideUserList = () => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const id = useSearch.useSearchId();
  const [deleteUserId, setDeleteUserId] = useState<null | Number>(null);
  const [isHover, setIsHover] = useState(false);

  const { data: userList, isLoading: userListLoading } =
    useCalendarQueries.useGetCalendarPermissionList(id);

  const { mutate: deleteCalendarPermission } = useMutation({
    mutationFn: useCalendarMutations.deleteCalendarPermission,
  });

  const handleDeletePermission = () => {
    deleteCalendarPermission(
      { calendarId: id, userId: deleteUserId },
      {
        onSuccess: (result) => {
          if (result) {
            alert("유저 추방에 성공하였습니다.");
          } else {
            alert("유저 추방에 실패하였습니다.");
          }
          window.location.reload();
        },
        onError: () => {
          console.log("실패");
        },
      }
    );
  };

  const handleClickDeletePermission = (userId: number) => {
    setIsConfirmOpen(true);
    setDeleteUserId(userId);
  };
  const handleUserMouse = (bool: boolean) => setIsHover(bool);

  return (
    <div
      onMouseEnter={() => handleUserMouse(true)}
      onMouseLeave={() => handleUserMouse(false)}
      className="flex flex-col items-start justify-start w-full space-y-3 mt-5"
    >
      {userList?.map((user: any) => (
        <div
          key={user.id}
          className="flex items-center justify-between w-[300px]"
        >
          <div className="flex items-center">
            <img
              className="w-11 h-11 rounded-full bor"
              src={user.img === "" ? process.env.NEXT_PUBLIC_LOGO : user.img}
            />
            <span className="ml-2">{user.name}</span>
          </div>
          {isHover && (
            <button
              onClick={() => {
                handleClickDeletePermission(user.userId);
              }}
              className="mr-4"
            >
              추방
            </button>
          )}
        </div>
      ))}
      <ModalWrapper setIsOpen={setIsConfirmOpen} isOpen={isConfirmOpen}>
        <DeleteModal
          setIsOpen={setIsConfirmOpen}
          mutateFn={handleDeletePermission}
          msg=" 정말 해당 유저를 추방하시겠습니까?"
        />
      </ModalWrapper>
    </div>
  );
};

export default SideUserList;
