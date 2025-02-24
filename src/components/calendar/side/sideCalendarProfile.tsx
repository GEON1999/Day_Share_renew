import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconCircleSetting } from "@/icons";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useRouter } from "next/navigation";

const SideCalendarProfile = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const { data, isLoading } = useCalendarQueries.useGetCalendarBasic(id);

  const handleClickSetting = () => router.push(`/calendar/${id}/setting`);

  const handleCalendarProfileClick = () =>
    router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);

  return (
    <div
      className={`flex flex-col items-center ${
        isOpen ? "mt-[20px]" : "mt-[50px] lg:mt-[42px]"
      } `}
    >
      <img
        onClick={handleCalendarProfileClick}
        className={` lg:w-[191.5px] lg:h-[127.67px] bor lg:shadow_box lg:rounded-md cur object-cover ${
          isOpen
            ? "w-[156px] h-[104px] shadow_box rounded-md"
            : "w-[30px] h-[30px] rounded-full"
        }`}
        src={data?.img == "" ? process.env.NEXT_PUBLIC_CALENDAR_IMG : data?.img}
        alt="calendar"
      />
      <IconCircleSetting
        onClick={handleClickSetting}
        className={`w-[30px] h-[30px] absolute top-[208px] left-[187px] lg:top-[320px] lg:left-[203px] lg:block cur ${
          isOpen ? "block" : "hidden"
        }`}
      />
      <p
        className={`mt-[14px] text_lg lg:block ${isOpen ? "block" : "hidden"}`}
      >
        {data?.name}
      </p>
    </div>
  );
};

export default SideCalendarProfile;
