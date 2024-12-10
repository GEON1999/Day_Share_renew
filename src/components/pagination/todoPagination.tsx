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

    console.log("params", params.toString());
    router.push(`${pathName}?${params.toString()}`);
  };
  return (
    <div className="flex items-center justify-center space-x-[11px] mb-[13px]">
      <div>
        {Number(currentTodoPage) <= 1 ? (
          <IconPrev_disabled className="w-1 h-2 cur" />
        ) : (
          <IconPrev className="w-[5px] h-2 cur" onClick={handleTodoPrevBtn} />
        )}
      </div>

      <p className="text-[12px]">{currentTodoPage}</p>
      <div>
        {total_count <= Number(currentTodoPage) * 4 ? (
          <IconNext_disabled className="w-1 h-2 cur" />
        ) : (
          <IconNext className="w-[5px] h-2 cur" onClick={handleTodoNextBtn} />
        )}
      </div>
    </div>
  );
};

export default TodoPagination;
