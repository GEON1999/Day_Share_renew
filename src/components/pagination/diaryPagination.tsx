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
    <div className="pagination">
      <div>
        {Number(currentDiaryPage) <= 1 ? (
          <IconPrev_disabled className="pagination_btn_disabled" />
        ) : (
          <IconPrev className="pagination_btn" onClick={handleDiaryPrevBtn} />
        )}
      </div>

      <p>{currentDiaryPage}</p>
      <div>
        {total_count <= Number(currentDiaryPage) * 4 ? (
          <IconNext_disabled className="pagination_btn_disabled" />
        ) : (
          <IconNext className="pagination_btn" onClick={handleDiaryNextBtn} />
        )}
      </div>
    </div>
  );
};

export default DiaryPagination;
