import ModalWrapper from "@/components/modal/ModalWrapper";
import SettingModal from "@/components/modal/SettingModal";
import useSearch from "@/hooks/useSearch";
import { IconCircleSetting, IconSetting } from "@/icons";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useState } from "react";

const SideCalendarProfile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const id = useSearch.useSearchId();
  const { data, isLoading } = useCalendarQueries.useGetCalendarDates(id);
  console.log(data);

  const handleClickSetting = () => setIsOpen(true);

  return (
    <div className="flex flex-col items-center mt-[42px]">
      <img
        className="w-[191px] h-[127px] bor shadow_box rounded-md"
        src={data?.calendar?.img}
        alt="calendar"
      />
      <IconCircleSetting
        onClick={handleClickSetting}
        className="w-[30px] h-[30px] absolute top-[302px] left-[203px] cur"
      />
      <p className="mt-[19px] text-[20px]">{data?.calendar?.name}</p>

      <ModalWrapper setIsOpen={setIsOpen} isOpen={isOpen}>
        <SettingModal setIsOpen={setIsOpen} />
      </ModalWrapper>
    </div>
  );
};

export default SideCalendarProfile;
