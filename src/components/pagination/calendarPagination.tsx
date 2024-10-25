import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";

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
      <img
        onClick={handlePrevBtn}
        className="cur"
        src={
          Number(currentPage) <= 1
            ? "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025133642_4badf52cc51b47d2b3aeafe96b3add5f.png"
            : "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183639_6d61ad5c8f084ca5a0987267645d79c2.png"
        }
      />
      <p>{currentPage}</p>
      <img
        onClick={handleNextBtn}
        className=" cur"
        src={
          total_count <= Number(currentPage) * 4
            ? "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025133818_3e927a99d2cb4586ad9aa6d026a72a7a.png"
            : "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183650_8d7f7c4e14fc4108b91642bf37dde397.png"
        }
      />
    </div>
  );
};

export default CalendarPagination;
