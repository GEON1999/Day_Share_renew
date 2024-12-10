// Dashboard.tsx
import DiarySection from "@/components/main/diarySection";
import CalendarListSection from "./calendarListSection";
import StatusSection from "./statusSection";
import GreetingSection from "./greetingSection";

const Dashboard = () => {
  return (
    <div className="main_container">
      <GreetingSection />
      <div className="flex space-x-10 mt-[53px] w-full items-strat">
        <StatusSection />
        <DiarySection />
      </div>
      <CalendarListSection />
    </div>
  );
};

export default Dashboard;
