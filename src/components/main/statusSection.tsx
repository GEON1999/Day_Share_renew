import { IconClose } from "@/icons";
import useUserMutations from "@/queries/user/useUserMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface EmotionData {
  id: string;
  text: string;
  imgSrc: string;
  hoverBg: string;
  containerBg: string;
}

export const emotionData: EmotionData[] = [
  {
    id: "JOY",
    text: "좋아",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022621_62e35e9def4f493cb6aed5bb103bd7bd.png",
    hoverBg: "group-hover:bg-[#FEDB69]",
    containerBg: "bg-[#FFF8C6]",
  },
  {
    id: "SAD",
    text: "속상해",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022654_f9482cad7ae24f6490e2de3dbd578da5.png",
    hoverBg: "group-hover:bg-[#B4FC7E]",
    containerBg: "bg-[#E6FFCD]",
  },
  {
    id: "ANGRY",
    text: "화나",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022535_1ed8050f691a48b187a8dad47e03f8fc.png",
    hoverBg: "group-hover:bg-[#FFADAD]",
    containerBg: "bg-[#FFDCDC]",
  },
  {
    id: "NORMAL",
    text: "그냥그래",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022709_64a7a29da24f4cf1ab0000c2d5db5eb8.png",
    hoverBg: "group-hover:bg-[#ACCDFF]",
    containerBg: "bg-[#CDE4F9]",
  },
];

const EmotionItem = ({
  emotion,
  onHover,
  onClick,
}: {
  emotion: EmotionData;
  onHover: (id: string | null) => void;
  onClick: () => void;
}) => (
  <div
    className="flex flex-col items-center group cur"
    onMouseEnter={() => onHover(emotion.id)}
    onMouseLeave={() => onHover(null)}
    onClick={onClick}
  >
    <img className="w-[80px] h-[80px]" src={emotion.imgSrc} alt={emotion.id} />
    <p
      className={`text-[15px] text-[#494949] rounded-full w-[65px] h-[20px] flex items-center justify-center ${emotion.hoverBg} transition-all duration-300`}
    >
      {emotion.text}
    </p>
  </div>
);

const StatusSection = () => {
  const { data, refetch } = useUserQueries.useGetUser();
  const [isOpen, setIsOpen] = useState(data.emotion === "EMPTY");
  const [hoverEmotion, setHoverEmotion] = useState<string | null>(null);

  const { mutate } = useMutation({
    mutationFn: useUserMutations.updateUserEmotion,
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
    },
    onError: () => {
      alert("감정 업데이트 실패");
    },
  });

  const handleUpdateEmotion = (emotion: string) => {
    mutate({ emotion: emotion.toUpperCase() });
  };

  const getBackgroundColor = (emotion: string | null) => {
    if (isOpen) {
      const hoverEmotionData = emotionData.find((e) => e.id === hoverEmotion);
      return hoverEmotionData ? hoverEmotionData.containerBg : "";
    }

    const currentEmotionData = emotionData.find(
      (e) => e.id.toLowerCase() === data.emotion.toLowerCase()
    );
    return currentEmotionData ? currentEmotionData.containerBg : "";
  };

  return (
    <section className={`flex flex-col items-center w-[256px]`}>
      <h2 className={`dashboard_title`}>현재의 감정</h2>
      <div
        className={`status_box bor transition-colors duration-300 ${getBackgroundColor(
          hoverEmotion
        )}`}
      >
        {isOpen ? (
          <div className="flex flex-col items-center gap-[14px] mt-[40px]">
            <IconClose
              onClick={() => setIsOpen(false)}
              className="absolute top-[401px] rounded-full bg-transparent w-[20px] h-[20px] flex items-center justify-center cursor-pointer"
            />
            <div className="flex items-center gap-[31px]">
              {emotionData.slice(0, 2).map((emotion) => (
                <EmotionItem
                  key={emotion.id}
                  emotion={emotion}
                  onHover={setHoverEmotion}
                  onClick={() => handleUpdateEmotion(emotion.id)}
                />
              ))}
            </div>
            <div className="flex items-center gap-[31px]">
              {emotionData.slice(2, 4).map((emotion) => (
                <EmotionItem
                  key={emotion.id}
                  emotion={emotion}
                  onHover={setHoverEmotion}
                  onClick={() => handleUpdateEmotion(emotion.id)}
                />
              ))}
            </div>
          </div>
        ) : (
          <div onClick={() => setIsOpen(true)}>
            <img
              className="w-[200px] h-[200px] mt-13 cur "
              src={
                emotionData.find((e) => e.id.toUpperCase() === data.emotion)
                  ?.imgSrc
              }
              alt={data.emotion.toLowerCase()}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default StatusSection;
