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
    <div className="flex items-center justify-center space-x-[13px] mb-[13px]">
      <div className="w-4 h-5 cur">
        {Number(currentTodoPage) <= 1 ? (
          <IconPrev_disabled />
        ) : (
          <IconPrev onClick={handleTodoPrevBtn} />
        )}
      </div>

      <p>{currentTodoPage}</p>
      <div className="w-4 h-5 cur">
        {total_count <= Number(currentTodoPage) * 4 ? (
          <IconNext_disabled />
        ) : (
          <IconNext onClick={handleTodoNextBtn} />
        )}
      </div>
    </div>
  );
};

export default TodoPagination;
