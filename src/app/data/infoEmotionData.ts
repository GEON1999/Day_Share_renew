export interface InfoEmotionData {
  id: number;
  name: string;
  image: string;
}

export const infoEmotionData: InfoEmotionData[] = [
  {
    id: 1,
    name: "화나",
    image: "/images/emotion_angry.png",
  },
  {
    id: 2,
    name: "좋아",
    image: "/images/emotion_joy.png",
  },
  {
    id: 3,
    name: "속상해",
    image: "/images/emotion_sad.png",
  },
  {
    id: 4,
    name: "그냥그래",
    image: "/images/emotion_normal.png",
  },
];
