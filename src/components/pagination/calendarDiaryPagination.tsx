import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";
import {
  IconPrev,
  IconPrev_disabled,
  IconNext,
  IconNext_disabled,
} from "@/icons";

const CalendarDiaryPagination = ({ total_count }: any) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentPage = useSearch.useSearchCalendarDiaryPage();
  const handlePrevBtn = () => {
    if (currentPage === "1") return;
    params.set("calendar_diary_page", String(Number(currentPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleNextBtn = () => {
    if (total_count <= Number(currentPage) * 3) return;
    params.set("calendar_diary_page", String(Number(currentPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="flex items-center space-x-[11px]">
      <div>
        {Number(currentPage) <= 1 ? (
          <IconPrev_disabled className="w-1 h-[10px] cur" />
        ) : (
          <IconPrev className="w-[5px] h-[10px] cur" onClick={handlePrevBtn} />
        )}
      </div>
      <p className="text-[#2D2D2E] text-[20px]">{currentPage}</p>
      <div>
        {total_count <= Number(currentPage) * 3 ? (
          <IconNext_disabled className="w-1 h-[10px] cur" />
        ) : (
          <IconNext className="w-[5px] h-[10px] cur" onClick={handleNextBtn} />
        )}
      </div>
    </div>
  );
};

export default CalendarDiaryPagination;
