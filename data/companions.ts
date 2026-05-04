// Atoms 원본 Index.tsx 31~120줄에 정의된 ALL_COMPANIONS 배열을 그대로 분리.

export interface Companion {
  id: number;
  nickname: string;
  avatar: string;
  interests: string[];
  style: string;
  intro: string;
  color: string;
  destinationIds: number[];
  isLookingForCompanion: boolean;
}

export const ALL_COMPANIONS: Companion[] = [
  {
    id: 1,
    nickname: "여행하는 고양이 🐱",
    avatar: "🧑‍🎨",
    interests: ["마트 어택", "뷰티 트래블"],
    style: "느긋한 힐링 여행파",
    intro: "현지 마트 탐방을 좋아하는 6년차 여행러입니다. 같이 장보러 가요!",
    color: "#FF6B35",
    destinationIds: [1, 2, 3, 4, 5, 28, 29],
    isLookingForCompanion: true,
  },
  {
    id: 2,
    nickname: "산악인 준호 ⛰️",
    avatar: "🧗",
    interests: ["산악 바이브", "로드트립"],
    style: "액티브 모험 여행파",
    intro: "돌로미티 트레킹 동행 구합니다! 중급 이상 체력이면 환영해요.",
    color: "#2E7D32",
    destinationIds: [10, 11, 12, 13, 22, 23, 24],
    isLookingForCompanion: true,
  },
  {
    id: 3,
    nickname: "책벌레 수진 📖",
    avatar: "👩‍💼",
    interests: ["책 스케이프", "콰이어트케이션"],
    style: "조용한 문화 여행파",
    intro: "파리 독립서점 투어 같이 하실 분! 커피 한 잔 하며 책 이야기 나눠요.",
    color: "#7C4DFF",
    destinationIds: [6, 7, 8, 9, 18, 19, 20, 21],
    isLookingForCompanion: true,
  },
  {
    id: 4,
    nickname: "푸디 민지 🍜",
    avatar: "👩‍🍳",
    interests: ["마트 어택", "스킬 시커"],
    style: "미식 탐험 여행파",
    intro: "방콕 야시장 먹방 투어 동행 찾아요. 매운 거 잘 먹는 분 환영!",
    color: "#E65100",
    destinationIds: [2, 4, 5, 14, 15, 16, 17],
    isLookingForCompanion: false,
  },
  {
    id: 5,
    nickname: "스포츠광 태현 ⚽",
    avatar: "🏃",
    interests: ["팬덤 스포츠", "로드트립"],
    style: "열정 스포츠 여행파",
    intro: "캄프 누에서 같이 축구 보실 분! 유럽 스포츠 투어 동행 구해요.",
    color: "#C62828",
    destinationIds: [25, 26, 27, 22, 23],
    isLookingForCompanion: true,
  },
  {
    id: 6,
    nickname: "힐링 요정 하나 🧘",
    avatar: "🧘‍♀️",
    interests: ["콰이어트케이션", "뷰티 트래블"],
    style: "힐링 & 웰니스 여행파",
    intro: "발리 요가 리트릿 같이 가요! 조용한 곳에서 힐링하고 싶어요.",
    color: "#5C6BC0",
    destinationIds: [15, 18, 19, 20, 21, 29, 30],
    isLookingForCompanion: true,
  },
  {
    id: 7,
    nickname: "교토러버 유키 🎎",
    avatar: "👘",
    interests: ["스킬 시커", "책 스케이프"],
    style: "문화 체험 여행파",
    intro: "교토 다도 체험 같이 하실 분! 일본 전통문화에 관심 많아요.",
    color: "#00897B",
    destinationIds: [7, 17, 1, 8],
    isLookingForCompanion: false,
  },
  {
    id: 8,
    nickname: "뷰티헌터 소연 💄",
    avatar: "💅",
    interests: ["뷰티 트래블", "마트 어택"],
    style: "뷰티 쇼핑 여행파",
    intro: "서울 K-뷰티 투어 같이 돌아요! 올리브영 성지순례 필수!",
    color: "#AD1457",
    destinationIds: [28, 29, 30, 2, 4],
    isLookingForCompanion: true,
  },
];
