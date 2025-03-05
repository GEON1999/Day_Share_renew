// 서버 프로필 섹션 컴포넌트
const ProfileSection = ({
  calendarUserData,
  handleChangeProfile,
}: {
  calendarUserData?: { name: string };
  handleChangeProfile: () => void;
}) => (
  <div className="flex flex-col space-y-[3px] relative">
    <label className="text_lg">서버 프로필</label>
    <input
      className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md focus:outline-none text-opacity-10 cursor-not-allowed bg-white"
      defaultValue={calendarUserData?.name ?? ""}
      disabled
    />
    <button
      className="absolute right-[6px] lg:right-[16px] bottom-[5px] lg:bottom-[10px] w-[109px] h-[30px] cur rounded-full border-[0.8px] border-[#49494950] text_base hover:bg-[#49494910] hover:border-[#49494950]"
      onClick={handleChangeProfile}
      type="button"
    >
      프로필 변경
    </button>
  </div>
);

export default ProfileSection;
