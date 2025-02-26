import useUserQueries from "@/queries/user/useUserQueries";

const ProfileSection = ({ isOpen }: { isOpen: boolean }) => {
  const { data: userData } = useUserQueries.useGetUser();

  const profileImageUrl =
    userData?.img && userData.img !== ""
      ? userData.img
      : process.env.NEXT_PUBLIC_PROFILE_IMG;

  return (
    <>
      <div className={`${isOpen ? "hidden" : "block lg:hidden mt-[50px]"}`}>
        <img
          src={profileImageUrl}
          alt="프로필 이미지"
          className="w-[30px] h-[30px] object-cover rounded-full bg-gray-200 bor"
        />
      </div>
      <div
        className={`${
          isOpen
            ? "flex flex-col items-center"
            : "hidden lg:flex flex-col items-center"
        }`}
      >
        <img
          src={profileImageUrl}
          alt="프로필 이미지"
          className="w-[100px] lg:w-[140px] h-[100px] lg:h-[140px] object-cover rounded-full bg-gray-200 bor mt-[10px] lg:mt-[36px] shadow_box"
        />
        <p className="text-[20px] mt-[8px]">{userData?.name}</p>
      </div>
    </>
  );
};

export default ProfileSection;
