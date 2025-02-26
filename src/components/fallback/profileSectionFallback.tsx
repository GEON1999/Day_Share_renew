const ProfileSectionFallback = ({ isOpen }: { isOpen: boolean }) => {
  return (
    <>
      <div className={`${isOpen ? "hidden" : "block lg:hidden mt-[50px]"}`}>
        <div className="w-[30px] h-[30px] rounded-full bg-gray-200 animate-pulse"></div>
      </div>
      <div
        className={`${
          isOpen
            ? "flex flex-col items-center"
            : "hidden lg:flex flex-col items-center"
        }`}
      >
        <div className="w-[100px] lg:w-[140px] h-[100px] lg:h-[140px] rounded-full bg-gray-200 animate-pulse mt-[10px] lg:mt-[36px]"></div>
        <div className="h-[20px] w-[80px] bg-gray-200 animate-pulse mt-[8px] rounded"></div>
      </div>
    </>
  );
};

export default ProfileSectionFallback;
