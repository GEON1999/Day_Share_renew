import useUserQueries from "@/queries/user/useUserQueries";

const GreetingSection = () => {
  const { data: favoriteTodoData } = useUserQueries.useGetUserFavoriteTodo();

  return (
    <section className="mt-[33px]">
      <h1 className="text-[50px]">안녕하세요, 박건님.</h1>
      {favoriteTodoData?.title ? (
        <p className="text-[50px]">
          주요 일정은
          <span className="text-red-500 bg_hilight p-1">
            {favoriteTodoData?.title}
          </span>
          입니다.
        </p>
      ) : (
        <p className="text-[40px]">주요 일정을 설정해 보세요!</p>
      )}
    </section>
  );
};
export default GreetingSection;
