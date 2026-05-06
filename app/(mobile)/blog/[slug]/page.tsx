// 매거진 상세: content/blog/{slug}.md 본문을 react-markdown으로 렌더.
// 본문 첫 줄에 # H1 + hero ![]()가 이미 있으므로 페이지 헤더는 별도 두지 않고
// "← 매거진" 뒤로가기 링크만 표시.
// 정적 prerender (generateStaticParams).

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";

const FONT = "'Noto Sans KR', sans-serif";

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "매거진 | 나만의 여행" };
  return {
    title: `${post.title} | 나만의 여행`,
    description: post.description,
    keywords: post.keywords.split(",").map((k) => k.trim()),
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      images: [{ url: post.hero }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: [post.hero],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <div className="flex-1 overflow-y-auto px-5 pt-6 pb-24" style={{ fontFamily: FONT }}>
      <Link
        href="/blog"
        className="inline-flex items-center gap-1 text-[12px] mb-3 no-underline"
        style={{ color: "#8a8478", fontFamily: FONT }}
      >
        ← 매거진
      </Link>

      <article className="blog-prose">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeSlug,
            [
              rehypeAutolinkHeadings,
              { behavior: "wrap", properties: { className: "anchor" } },
            ],
          ]}
          components={{
            img: ({ src, alt }) => {
              const url = typeof src === "string" ? src : "";
              if (!url) return null;
              const avif = url.replace(/\.jpe?g$/i, ".avif");
              return (
                <picture>
                  <source srcSet={avif} type="image/avif" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={alt ?? ""}
                    loading="eager"
                    fetchPriority="high"
                  />
                </picture>
              );
            },
          }}
        >
          {post.content}
        </ReactMarkdown>
      </article>

      <div
        className="mt-8 flex flex-col gap-2 items-center"
        style={{
          background: "linear-gradient(135deg, #FF6B35, #E91E63)",
          borderRadius: 16,
          padding: "20px 16px",
        }}
      >
        <span
          className="text-[14px] font-bold"
          style={{ color: "#fff", fontFamily: FONT }}
        >
          📖 마음에 드셨나요?
        </span>
        <Link
          href="/"
          className="text-[13px] font-bold px-5 py-2 rounded-full no-underline"
          style={{
            background: "#fff",
            color: "#FF6B35",
            fontFamily: FONT,
          }}
        >
          이 여행 시작하기 →
        </Link>
      </div>
    </div>
  );
}
