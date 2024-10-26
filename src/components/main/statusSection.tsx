import { dodum } from "@/app/fonts";

const StatusSection = () => {
  return (
    <section
      className={`flex flex-col items-center w-[256px] ${dodum.className}`}
    >
      <h2 className={`dashboard_title ${dodum.className}`}>오늘 감정</h2>
      <div className="status_box bor">
        <p className="text-[20px] mt-[49px]">수정 원고 달라고!</p>
        <img src="https://s3.ap-northeast-2.amazonaws.com/geon.com/20241026150745_811e1185e022459cbc140bab706b78c4.png" />
      </div>
    </section>
  );
};

export default StatusSection;
