import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";
import {
  IconPrev,
  IconPrev_disabled,
  IconNext,
  IconNext_disabled,
} from "@/icons";

const DiaryPagination = ({ total_count }: any) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentDiaryPage = useSearch.useSearchDiaryPage();
  const handleDiaryPrevBtn = () => {
    if (currentDiaryPage === "1") return;
    params.set("diary_page", String(Number(currentDiaryPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleDiaryNextBtn = () => {
    if (total_count <= Number(currentDiaryPage) * 4 || !total_count) return;
    params.set("diary_page", String(Number(currentDiaryPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="flex items-center space-x-[13px]">
      <div className="w-4 h-5 cur">
        {Number(currentDiaryPage) <= 1 ? (
          <IconPrev_disabled />
        ) : (
          <IconPrev onClick={handleDiaryPrevBtn} />
        )}
      </div>

      <p>{currentDiaryPage}</p>
      <div className="w-4 h-5 cur">
        {total_count <= Number(currentDiaryPage) * 4 ? (
          <IconNext_disabled />
        ) : (
          <IconNext onClick={handleDiaryNextBtn} />
        )}
      </div>
    </div>
  );
};

export default DiaryPagination;
