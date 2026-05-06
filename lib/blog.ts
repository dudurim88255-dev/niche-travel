// content/blog/*.md 를 빌드 시 읽어 frontmatter + 본문을 노출.
// frontmatter 형식: { title, description, keywords, lang } (5편 모두 동일)
// hero 이미지는 본문 첫 ![]() 마크다운으로 들어 있어 별도로 다루지 않음.

import { promises as fs } from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export interface BlogFrontmatter {
  title: string;
  description: string;
  keywords: string;
  lang: string;
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string;
  hero: string; // public/assets 절대 경로
}

export interface BlogPost extends BlogPostMeta {
  content: string;
}

function pickFrontmatter(data: Record<string, unknown>): BlogFrontmatter {
  return {
    title: typeof data.title === "string" ? data.title : "",
    description: typeof data.description === "string" ? data.description : "",
    keywords: typeof data.keywords === "string" ? data.keywords : "",
    lang: typeof data.lang === "string" ? data.lang : "ko",
  };
}

export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name.replace(/\.md$/, ""))
    .sort();

  const posts = await Promise.all(
    slugs.map(async (slug) => {
      const file = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf-8");
      const { data } = matter(file);
      const fm = pickFrontmatter(data);
      return {
        ...fm,
        slug,
        hero: `/assets/${slug}-hero.jpg`,
      };
    })
  );
  return posts;
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const file = await fs.readFile(path.join(BLOG_DIR, `${slug}.md`), "utf-8");
    const { data, content } = matter(file);
    const fm = pickFrontmatter(data);
    return {
      ...fm,
      slug,
      hero: `/assets/${slug}-hero.jpg`,
      content,
    };
  } catch {
    return null;
  }
}

export async function getAllSlugs(): Promise<string[]> {
  const entries = await fs.readdir(BLOG_DIR, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.endsWith(".md"))
    .map((e) => e.name.replace(/\.md$/, ""))
    .sort();
}
