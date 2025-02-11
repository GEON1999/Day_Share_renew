export interface EmotionData {
  id: string;
  text: string;
  imgSrc: string;
  hoverBg: string;
  containerBg: string;
  hoverTextColor: string;
}

export const emotionData: EmotionData[] = [
  {
    id: "JOY",
    text: "좋아",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022621_62e35e9def4f493cb6aed5bb103bd7bd.png",
    hoverBg: "group-hover:bg-[#FEDB69]",
    containerBg: "bg-[#FFF8C6]",
    hoverTextColor: "bg-[#FEDB69]",
  },
  {
    id: "SAD",
    text: "속상해",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022654_f9482cad7ae24f6490e2de3dbd578da5.png",
    hoverBg: "group-hover:bg-[#B4FC7E]",
    containerBg: "bg-[#E6FFCD]",
    hoverTextColor: "bg-[#B4FC7E]",
  },
  {
    id: "ANGRY",
    text: "화나",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022535_1ed8050f691a48b187a8dad47e03f8fc.png",
    hoverBg: "group-hover:bg-[#FFADAD]",
    containerBg: "bg-[#FFDCDC]",
    hoverTextColor: "bg-[#FFADAD]",
  },
  {
    id: "NORMAL",
    text: "그냥그래",
    imgSrc:
      "https://s3.ap-northeast-2.amazonaws.com/geon.com/20241220022709_64a7a29da24f4cf1ab0000c2d5db5eb8.png",
    hoverBg: "group-hover:bg-[#ACCDFF]",
    containerBg: "bg-[#CDE4F9]",
    hoverTextColor: "bg-[#ACCDFF]",
  },
];
