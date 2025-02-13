import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";
import {
  IconPrev,
  IconPrev_disabled,
  IconNext,
  IconNext_disabled,
} from "@/icons";

const ChatRoomPagination = ({ total_count }: any) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentPage = useSearch.useSearchChatPage();
  const handlePrevBtn = () => {
    if (currentPage === "1") return;
    params.set("chat_page", String(Number(currentPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleNextBtn = () => {
    if (total_count <= Number(currentPage) * 10) return;
    params.set("chat_page", String(Number(currentPage) + 1));
    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="pagination">
      <div>
        {Number(currentPage) <= 1 ? (
          <IconPrev_disabled className="pagination_btn_disabled" />
        ) : (
          <IconPrev className="pagination_btn" onClick={handlePrevBtn} />
        )}
      </div>
      <p className="text-[#2D2D2E] text-[20px]">{currentPage}</p>
      <div>
        {total_count <= Number(currentPage) * 10 ? (
          <IconNext_disabled className="pagination_btn_disabled" />
        ) : (
          <IconNext className="pagination_btn" onClick={handleNextBtn} />
        )}
      </div>
    </div>
  );
};

export default ChatRoomPagination;
