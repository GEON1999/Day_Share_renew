import { IconClose } from "@/icons";
import { useAlert } from "@/components/alert/AlertContext";
import useUserMutations from "@/queries/user/useUserMutations";
import useUserQueries from "@/queries/user/useUserQueries";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { EmotionData, emotionData } from "@/app/data/emotionData";

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
    <img
      className="w-[36px] h-[36px] lg:w-[80px] lg:h-[80px]"
      src={emotion.imgSrc}
      alt={emotion.id}
    />
    <p
      className={`hidden text-[15px] rounded-full w-[65px] h-[20px] lg:flex items-center justify-center ${emotion.hoverBg} transition-all duration-300`}
    >
      {emotion.text}
    </p>
  </div>
);

const StatusSection = () => {
  const { data, refetch } = useUserQueries.useGetUser();
  const [isOpen, setIsOpen] = useState(data?.emotion === "EMPTY");
  const [hoverEmotion, setHoverEmotion] = useState<string | null>(null);
  const { showAlert } = useAlert();

  const { mutate } = useMutation({
    mutationFn: useUserMutations.updateUserEmotion,
    onSuccess: async () => {
      await refetch();
      setIsOpen(false);
    },
    onError: () => {
      showAlert("감정 업데이트 실패", "error");
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
      (e) => e.id.toLowerCase() === data?.emotion?.toLowerCase()
    );
    return currentEmotionData ? currentEmotionData.containerBg : "";
  };

  return (
    <section className={`flex flex-col items-center w-[256px]`}>
      <h2 className={`dashboard_title hidden lg:block`}>현재의 감정</h2>
      <div
        className={`status_box bor transition-colors duration-300 w-[98px] h-[102.85px] lg:w-[255.86px] lg:h-[268.51px] ${getBackgroundColor(
          hoverEmotion
        )}`}
      >
        {isOpen ? (
          <div className="flex flex-col items-center gap-[10px] lg:gap-[14px] mt-[15px] lg:mt-[40px]">
            <IconClose
              onClick={() => setIsOpen(false)}
              className="absolute mt-[36px] lg:mt-0 lg:top-[401px] rounded-full bg-transparent w-[12px] h-[12px] lg:w-[20px] lg:h-[20px] flex items-center justify-center cursor-pointer"
            />
            <div className="flex items-center gap-[10px] lg:gap-[31px]">
              {emotionData.slice(0, 2).map((emotion) => (
                <EmotionItem
                  key={emotion.id}
                  emotion={emotion}
                  onHover={setHoverEmotion}
                  onClick={() => handleUpdateEmotion(emotion.id)}
                />
              ))}
            </div>
            <div className="flex items-center gap-[10px] lg:gap-[31px]">
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
              className="w-[76.6px] h-[76.6px] mt-[17px] lg:mt-13 cur lg:w-[200px] lg:h-[200px] "
              src={
                emotionData.find((e) => e.id.toUpperCase() === data?.emotion)
                  ?.imgSrc
              }
              alt={data?.emotion?.toLowerCase()}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default StatusSection;
