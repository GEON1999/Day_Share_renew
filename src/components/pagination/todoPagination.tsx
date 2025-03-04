import useSearch from "@/hooks/useSearch";
import { usePathname, useRouter } from "next/navigation";
import {
  IconPrev,
  IconPrev_disabled,
  IconNext,
  IconNext_disabled,
} from "@/icons";

const TodoPagination = ({ total_count }: any) => {
  const router = useRouter();
  const params = useSearch.useParamsAll();
  const pathName = usePathname();
  const currentTodoPage = useSearch.useSearchTodoPage();
  const handleTodoPrevBtn = () => {
    if (currentTodoPage === "1") return;
    params.set("todo_page", String(Number(currentTodoPage) - 1));
    router.push(`${pathName}?${params.toString()}`);
  };

  const handleTodoNextBtn = () => {
    if (total_count <= Number(currentTodoPage) * 4) return;
    params.set("todo_page", String(Number(currentTodoPage) + 1));

    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="pagination justify-center">
      <div>
        {Number(currentTodoPage) <= 1 ? (
          <IconPrev_disabled className="pagination_btn_disabled" />
        ) : (
          <IconPrev className="pagination_btn" onClick={handleTodoPrevBtn} />
        )}
      </div>

      <p className="text-[#2D2D2E] text-[15px]">{currentTodoPage}</p>
      <div>
        {total_count <= Number(currentTodoPage) * 4 ? (
          <IconNext_disabled className="pagination_btn_disabled" />
        ) : (
          <IconNext className="pagination_btn" onClick={handleTodoNextBtn} />
        )}
      </div>
    </div>
  );
};

export default TodoPagination;
