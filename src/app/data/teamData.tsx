export interface TeamData {
  name: string;
  role: string;
  image: string;
  color: string;
  bg: string;
}

export const TeamData: TeamData[] = [
  {
    name: "박건",
    role: "개발자",
    image: "/Images/team_1.png",
    color: "text-[#CDE4F9]",
    bg: "bg-[#CDE4F9]",
  },
  {
    name: "차민경",
    role: "헤드 디자이너",
    image: "/Images/team_2.png",
    color: "text-[#FFF0A3]",
    bg: "bg-[#FFF0A3]",
  },
  {
    name: "강보희",
    role: "디자이너",
    image: "/Images/team_3.png",
    color: "text-[#E2FF9B]",
    bg: "bg-[#E2FF9B]",
  },
  {
    name: "박예지",
    role: "디자이너",
    image: "/Images/team_4.png",
    color: "text-[#FFDED1]",
    bg: "bg-[#FFDED1]",
  },
];
