// Dashboard.tsx
import DiarySection from "@/components/main/diarySection";
import CalendarListSection from "./calendarListSection";
import StatusSection from "./statusSection";
import GreetingSection from "./greetingSection";

const Dashboard = () => {
  return (
    <div className="main_container py-[40px] lg:py-[30px]">
      <div className="flex items-center space-x-[10px] lg:space-x-0 lg:flex-none">
        <div className="lg:hidden block">
          <StatusSection />
        </div>
        <GreetingSection />
      </div>
      <div className="flex lg:space-x-10 mt-[20px] lg:mt-[53px] w-full items-strat">
        <div className="hidden lg:block">
          <StatusSection />
        </div>
        <DiarySection />
      </div>
      <CalendarListSection />
    </div>
  );
};

export default Dashboard;
