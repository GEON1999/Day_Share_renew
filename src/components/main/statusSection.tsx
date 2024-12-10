import { dodum } from "@/app/fonts";
import { IconAngryEmotion } from "@/icons";

const StatusSection = () => {
  return (
    <section
      className={`flex flex-col items-center w-[256px] ${dodum.className}`}
    >
      <h2 className={`dashboard_title ${dodum.className}`}>오늘 감정</h2>
      <div className="status_box bor">
        {/* <img
          className=" mt-[60px]"
          src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241026150745_811e1185e022459cbc140bab706b78c4.png"
        /> */}
        <IconAngryEmotion className="w-[200px] h-[200px] mt-13" />
      </div>
    </section>
  );
};

export default StatusSection;
