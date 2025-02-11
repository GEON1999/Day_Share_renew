import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";
import {
  IconPrev,
  IconPrev_disabled,
  IconNext,
  IconNext_disabled,
} from "@/icons";

const CalendarCreateContentPagination = ({ total_count }: any) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentPage = useSearch.useSearchCreateContentHomePage();
  const handlePrevBtn = () => {
    if (currentPage === "1") return;
    params.set("create_content_home_page", String(Number(currentPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleNextBtn = () => {
    if (total_count <= Number(currentPage) * 4) return;
    params.set("create_content_home_page", String(Number(currentPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="pagination mr-[15px]">
      <div>
        {Number(currentPage) <= 1 ? (
          <IconPrev_disabled className="pagination_btn_disabled" />
        ) : (
          <IconPrev className="pagination_btn" onClick={handlePrevBtn} />
        )}
      </div>

      <p>{currentPage}</p>
      <div>
        {total_count <= Number(currentPage) * 4 ? (
          <IconNext_disabled className="pagination_btn_disabled" />
        ) : (
          <IconNext className="pagination_btn" onClick={handleNextBtn} />
        )}
      </div>
    </div>
  );
};

export default CalendarCreateContentPagination;
