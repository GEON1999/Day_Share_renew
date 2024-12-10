import { dodum } from "@/app/fonts";
import useUserQueries from "@/queries/user/useUserQueries";

const GreetingSection = () => {
  const { data: favoriteTodoData } = useUserQueries.useGetUserFavoriteTodo();

  return (
    <section className={`mt-[33px] text-[40px] ${dodum.className}`}>
      <h1>안녕하세요, 박건님.</h1>
      {favoriteTodoData?.title ? (
        <p>
          혹시 &nbsp;
          <span className=" bg_hilight px-1">{favoriteTodoData?.title}</span>
          &nbsp; 잊지 않으셨나요?
        </p>
      ) : (
        <p>주요 일정을 설정해 보세요!</p>
      )}
    </section>
  );
};
export default GreetingSection;
