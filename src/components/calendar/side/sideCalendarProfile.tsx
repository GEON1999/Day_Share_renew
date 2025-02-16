import Helper from "@/helper/Helper";
import useSearch from "@/hooks/useSearch";
import { IconCircleSetting } from "@/icons";
import useCalendarQueries from "@/queries/calendar/useCalendarQueries";
import { useRouter } from "next/navigation";

const SideCalendarProfile = () => {
  const router = useRouter();
  const id = useSearch.useSearchId();
  const date = useSearch.useSearchDate();
  const { data, isLoading } = useCalendarQueries.useGetCalendarBasic(id);

  const handleClickSetting = () => router.push(`/calendar/${id}/setting`);

  const handleCalendarProfileClick = () =>
    router.push(`/calendar/${id}?date=${Helper.getTodayMs()}`);

  return (
    <div className="flex flex-col items-center mt-[42px] ">
      <img
        onClick={handleCalendarProfileClick}
        className="w-[191.5px] h-[127.67px] bor shadow_box rounded-md cur object-cover"
        src={data?.img == "" ? process.env.NEXT_PUBLIC_CALENDAR_IMG : data?.img}
        alt="calendar"
      />
      <IconCircleSetting
        onClick={handleClickSetting}
        className="w-[30px] h-[30px] absolute top-[302px] left-[203px] cur"
      />
      <p className="mt-[14px] text-[20px]">{data?.name}</p>
    </div>
  );
};

export default SideCalendarProfile;
