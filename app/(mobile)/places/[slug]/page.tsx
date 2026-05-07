// /places/[slug] 상세 페이지 — Phase 8 핵심.
// generateStaticParams로 30개 정적 prerender. server component (async).
// MapPreview만 dynamic ssr:false.
// (mobile) layout의 height/overflow 정책에 맞춰 root에 flex-1 + overflow-y-auto.

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  DESTINATIONS,
  GLOBAL_DISCLAIMER,
  type Destination,
} from "@/data/destinations";
import { LikeButton } from "@/components/LikeButton";
import { SaveButton } from "@/components/SaveButton";
import { ShareButton } from "@/components/ShareButton";
import { RelatedCarousel } from "@/components/RelatedCarousel";
import MapPreviewClient from "@/components/MapPreviewClient";

const FONT = "'Noto Sans KR', sans-serif";

export async function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dest = DESTINATIONS.find((d) => d.slug === slug);
  if (!dest) return { title: "Not Found | 나만의 여행" };
  return {
    title: `${dest.title} | 나만의 여행`,
    description: dest.desc,
    openGraph: {
      title: dest.title,
      description: dest.desc,
      images: [{ url: dest.img }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: dest.title,
      description: dest.desc,
      images: [dest.img],
    },
  };
}

export default async function PlaceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dest = DESTINATIONS.find((d) => d.slug === slug);
  if (!dest) notFound();

  const related: Destination[] = DESTINATIONS.filter(
    (d) => d.cat === dest.cat && d.id !== dest.id
  ).slice(0, 4);

  return (
    <article
      className="flex-1 overflow-y-auto pb-24"
      style={{ fontFamily: FONT }}
    >
      {/* Hero */}
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Image
          src={dest.img}
          alt={dest.title}
          fill
          priority
          className="object-cover"
          sizes="(max-width: 420px) 100vw, 420px"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="text-xs uppercase tracking-wider text-white/80">
            {dest.location}
          </div>
          <h1 className="mt-1 text-2xl font-bold text-white">{dest.title}</h1>
        </div>
        <Link
          href="/"
          className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white no-underline backdrop-blur"
          aria-label="뒤로"
        >
          ←
        </Link>
      </div>

      {/* 액션 바 */}
      <div
        className="flex items-center justify-around border-b py-3"
        style={{ background: "#fff", borderColor: "#e8e3db" }}
      >
        <LikeButton destId={dest.id} />
        <SaveButton destId={dest.id} />
        <ShareButton dest={dest} />
      </div>

      {/* 본문 */}
      <div className="space-y-6 px-4 py-6">
        <p
          className="text-base leading-relaxed"
          style={{ color: "#5a5346" }}
        >
          {dest.desc}
        </p>

        {/* 메타 카드 */}
        {(dest.bestSeason || dest.duration || dest.budget) && (
          <div
            className="grid grid-cols-2 gap-3 rounded-xl p-4 text-sm"
            style={{ background: "#f5f0e8" }}
          >
            {dest.bestSeason && (
              <div>
                <div className="text-xs" style={{ color: "#8a8478" }}>
                  베스트 시즌
                </div>
                <div
                  className="mt-0.5 font-medium"
                  style={{ color: "#2d2a26" }}
                >
                  {dest.bestSeason}
                </div>
              </div>
            )}
            {dest.duration && (
              <div>
                <div className="text-xs" style={{ color: "#8a8478" }}>
                  소요 시간
                </div>
                <div
                  className="mt-0.5 font-medium"
                  style={{ color: "#2d2a26" }}
                >
                  {dest.duration}
                </div>
              </div>
            )}
            {dest.budget && (
              <div className="col-span-2">
                <div className="text-xs" style={{ color: "#8a8478" }}>
                  예상 예산
                </div>
                <div
                  className="mt-0.5 font-medium"
                  style={{ color: "#2d2a26" }}
                >
                  {dest.budget}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 자세한 설명 */}
        {dest.longDesc && (
          <section>
            <h2
              className="mb-2 text-lg font-semibold"
              style={{ color: "#2d2a26" }}
            >
              여행 가이드
            </h2>
            <p
              className="whitespace-pre-line text-sm leading-relaxed"
              style={{ color: "#5a5346" }}
            >
              {dest.longDesc}
            </p>
          </section>
        )}

        {/* 지도 */}
        <section>
          <h2
            className="mb-2 text-lg font-semibold"
            style={{ color: "#2d2a26" }}
          >
            위치
          </h2>
          <MapPreviewClient lat={dest.lat} lng={dest.lng} title={dest.title} />
        </section>

        {/* 팁 */}
        {dest.tips && dest.tips.length > 0 && (
          <section>
            <h2
              className="mb-2 text-lg font-semibold"
              style={{ color: "#2d2a26" }}
            >
              여행 팁
            </h2>
            <ul className="space-y-2">
              {dest.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-sm leading-relaxed"
                  style={{ color: "#5a5346" }}
                >
                  <span className="mt-0.5" style={{ color: "#FF6B35" }}>
                    ▸
                  </span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* 출처 */}
        {dest.sources && (
          <section className="text-xs" style={{ color: "#8a8478" }}>
            {dest.sources.official && (
              <div>
                공식 사이트:{" "}
                <a
                  href={dest.sources.official}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "#FF6B35" }}
                >
                  {dest.sources.official}
                </a>
              </div>
            )}
            {dest.sources.verifiedDate && (
              <div className="mt-1">정보 확인일: {dest.sources.verifiedDate}</div>
            )}
          </section>
        )}

        {/* Disclaimer (항목별 + 글로벌 항상 노출) */}
        <section
          className="rounded-lg p-3 text-xs leading-relaxed"
          style={{ background: "#fff7ed", color: "#7c2d12" }}
        >
          {dest.disclaimer && (
            <p className="mb-2 font-medium">⚠️ {dest.disclaimer}</p>
          )}
          <p style={{ color: "#92400e" }}>{GLOBAL_DISCLAIMER}</p>
        </section>

        {/* 관련 추천 */}
        {related.length > 0 && (
          <section>
            <h2
              className="mb-3 text-lg font-semibold"
              style={{ color: "#2d2a26" }}
            >
              비슷한 여행지
            </h2>
            <RelatedCarousel destinations={related} />
          </section>
        )}
      </div>
    </article>
  );
}
