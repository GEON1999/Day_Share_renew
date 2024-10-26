import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";

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
      <img
        onClick={handleDiaryPrevBtn}
        className="cur"
        src={
          Number(currentDiaryPage) <= 1
            ? "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025133642_4badf52cc51b47d2b3aeafe96b3add5f.png"
            : "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183639_6d61ad5c8f084ca5a0987267645d79c2.png"
        }
      />
      <img
        onClick={handleDiaryNextBtn}
        className=" cur"
        src={
          total_count <= Number(currentDiaryPage) * 4 || !total_count
            ? "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241025133818_3e927a99d2cb4586ad9aa6d026a72a7a.png"
            : "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241024183650_8d7f7c4e14fc4108b91642bf37dde397.png"
        }
      />
    </div>
  );
};

export default DiaryPagination;
