// 매거진 목록: content/blog/*.md frontmatter 기반 카드 5개.
// (mobile) route group 안 — MobileFrame max-w 420 + BottomNav 공통 셸.

import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "매거진 | 나만의 여행",
  description: "니치 여행 인사이트 — 마트 어택부터 동행 찾기까지",
  openGraph: {
    title: "매거진 | 나만의 여행",
    description: "니치 여행 인사이트 — 마트 어택부터 동행 찾기까지",
    type: "website",
  },
};

const FONT = "'Noto Sans KR', sans-serif";

export default async function BlogIndexPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-8 pb-24">
      <h2
        className="text-[22px] font-extrabold mb-1.5"
        style={{ color: "#2d2a26", fontFamily: FONT }}
      >
        📖 매거진
      </h2>
      <p
        className="text-[13px] mb-5"
        style={{ color: "#8a8478", fontFamily: FONT }}
      >
        니치 여행 인사이트 · 총 {posts.length}편
      </p>

      <ul className="flex flex-col gap-4">
        {posts.map((post, i) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="block bg-white overflow-hidden no-underline"
              style={{
                borderRadius: 16,
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              }}
            >
              <picture>
                <source
                  srcSet={post.hero.replace(/\.jpe?g$/i, ".avif")}
                  type="image/avif"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={post.hero}
                  alt=""
                  loading={i === 0 ? "eager" : "lazy"}
                  fetchPriority={i === 0 ? "high" : "auto"}
                  style={{
                    width: "100%",
                    aspectRatio: "16/9",
                    objectFit: "cover",
                    display: "block",
                    background: "#1a1a1a",
                  }}
                />
              </picture>
              <div style={{ padding: "14px 16px" }}>
                <h3
                  className="font-bold text-[15px] leading-snug mb-1.5"
                  style={{ color: "#2d2a26", fontFamily: FONT }}
                >
                  {post.title}
                </h3>
                <p
                  className="text-[12px] leading-relaxed line-clamp-2"
                  style={{ color: "#8a8478", fontFamily: FONT }}
                >
                  {post.description}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
