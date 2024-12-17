import ModalWrapper from "@/components/modal/ModalWrapper";
import SettingModal from "@/components/modal/SettingModal";
import useSearch from "@/hooks/useSearch";
import { IconCircleSetting, IconSetting } from "@/icons";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useRouter } from "next/navigation";
import { useState } from "react";

const SideCalendarProfile = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const id = useSearch.useSearchId();
  const { data, isLoading } = useCalendarQueries.useGetCalendarBasic(id);

  const handleClickSetting = () => setIsOpen(true);

  const handleCalendarProfileClick = () => router.push(`/calendar/${id}`);

  return (
    <div className="flex flex-col items-center mt-[42px] ">
      <img
        onClick={handleCalendarProfileClick}
        className="w-[191px] h-[127px] bor shadow_box rounded-md cur"
        src={data?.img ?? process.env.NEXT_PUBLIC_LOGO}
        alt="calendar"
      />
      <IconCircleSetting
        onClick={handleClickSetting}
        className="w-[30px] h-[30px] absolute top-[302px] left-[203px] cur"
      />
      <p className="mt-[19px] text-[20px]">{data?.name}</p>

      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <SettingModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </div>
  );
};

export default SideCalendarProfile;
