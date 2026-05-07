// 상세 페이지 하단의 같은 카테고리 추천 4개 가로 스크롤.
// next/image fill + sizes 활용. server component (인터랙션 없음).

import Link from "next/link";
import Image from "next/image";
import type { Destination } from "@/data/destinations";

const FONT = "'Noto Sans KR', sans-serif";

export function RelatedCarousel({
  destinations,
}: {
  destinations: Destination[];
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4">
      <div className="flex gap-3 pb-2">
        {destinations.map((d) => (
          <Link
            key={d.id}
            href={`/places/${d.slug}`}
            className="block w-40 flex-shrink-0 no-underline"
            style={{ fontFamily: FONT }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg">
              <Image
                src={d.img}
                alt={d.title}
                fill
                className="object-cover"
                sizes="160px"
              />
            </div>
            <div
              className="mt-1.5 text-xs font-medium leading-tight line-clamp-2"
              style={{ color: "#2d2a26" }}
            >
              {d.title}
            </div>
            <div
              className="text-[10px]"
              style={{ color: "#8a8478" }}
            >
              {d.location}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
