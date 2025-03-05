import { IconReload } from "@/icons";

const InviteCodeSection = ({
  inviteCode,
  reloadInviteCode,
  isInviteCodeSubmit,
}: {
  inviteCode?: { code: string };
  reloadInviteCode: () => void;
  isInviteCodeSubmit: boolean;
}) => (
  <div className="flex flex-col space-y-[3px] relative">
    <label className="text_lg">초대코드</label>
    <input
      disabled
      className="w-[260px] lg:w-[390px] h-[40px] lg:h-[50px] bor px-[19px] rounded-md focus:outline-none"
      defaultValue={inviteCode?.code}
      id="inviteCode"
    />
    <IconReload
      className={`absolute right-[7px] lg:right-[16px] bottom-[10px] lg:bottom-[15px] w-[23px] h-[20px] ${
        isInviteCodeSubmit ? "" : "cur"
      }`}
      onClick={reloadInviteCode}
    />
  </div>
);

export default InviteCodeSection;
