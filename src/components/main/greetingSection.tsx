import useUserQueries from "@/queries/user/useUserQueries";

const GreetingSection = () => {
  const { data: favoriteTodoData } = useUserQueries.useGetUserFavoriteTodo();
  const { data: userData } = useUserQueries.useGetUser();

  console.log(userData);
  return (
    <section className={`mt-[5px] text-[40px]`}>
      <h1>안녕하세요, {userData?.name}님.</h1>
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
