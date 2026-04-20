import HomeClient from "@/components/HomeClient";

// 1시간마다 재검증 (메인 페이지는 자주 바뀌지 않으므로)
export const revalidate = 3600;

export default function Home() {
  return <HomeClient />;
}
