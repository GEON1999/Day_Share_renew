import { dodum } from "@/app/fonts";
import useUserQueries from "@/queries/user/useUserQueries";

const GreetingSection = () => {
  const { data: favoriteTodoData } = useUserQueries.useGetUserFavoriteTodo();
  console.log("favoriteTodoData:", favoriteTodoData);

  return (
    <section className={`mt-[33px] text-[50px] ${dodum.className}`}>
      <h1>안녕하세요, 박건님.</h1>
      {favoriteTodoData?.title ? (
        <p>
          주요 일정은
          <span className=" bg_hilight px-1">{favoriteTodoData?.title}</span>
          입니다.
        </p>
      ) : (
        <p>주요 일정을 설정해 보세요!</p>
      )}
    </section>
  );
};
export default GreetingSection;
