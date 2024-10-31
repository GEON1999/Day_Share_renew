import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";
import {
  IconPrev,
  IconPrev_disabled,
  IconNext,
  IconNext_disabled,
} from "@/icons";

const CalendarPagination = ({ total_count }: any) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentPage = useSearch.useSearchPage();
  const handlePrevBtn = () => {
    if (currentPage === "1") return;
    params.set("page", String(Number(currentPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleNextBtn = () => {
    if (total_count <= Number(currentPage) * 4) return;
    params.set("page", String(Number(currentPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="flex items-center space-x-[13px]">
      <div className="w-4 h-5 cur">
        {Number(currentPage) <= 1 ? (
          <IconPrev_disabled />
        ) : (
          <IconPrev onClick={handlePrevBtn} />
        )}
      </div>

      <p>{currentPage}</p>
      <div className="w-4 h-5 cur">
        {total_count <= Number(currentPage) * 4 ? (
          <IconNext_disabled />
        ) : (
          <IconNext onClick={handleNextBtn} />
        )}
      </div>
    </div>
  );
};

export default CalendarPagination;
