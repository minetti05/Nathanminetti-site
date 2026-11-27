import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { imageSize } from "image-size";

const CONTENT = path.join(process.cwd(), "content");

function readDir<T>(dir: string): (T & { slug: string; body: string })[] {
  const full = path.join(CONTENT, dir);
  if (!fs.existsSync(full)) return [];
  return fs
    .readdirSync(full)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"))
    .filter((f) => f.toLowerCase() !== "readme.md")
    .map((file) => {
      const raw = fs.readFileSync(path.join(full, file), "utf8");
      const { data, content } = matter(raw);
      return { ...(data as T), slug: file.replace(/\.mdx?$/, ""), body: content.trim() };
    });
}

/* ---------- Case studies ---------- */

export type Media = {
  platform: "youtube" | "vimeo" | "spotify";
  id: string;
  confirmed?: boolean;
};

export type CaseStudy = {
  slug: string;
  body: string;
  client: string;
  project: string;
  title?: string;
  dek?: string;
  summary?: string;
  year: string;
  agency: string;
  role: string;
  featured: boolean;
  featuredOrder?: number;
  order?: number;
  media?: Media;
  image?: { src?: string; alt?: string };
  awards?: string[];
  press?: { outlet: string; date?: string; url: string }[];
};

/** Sort key: the first four-digit year, so "2021–2022" sorts as 2021. */
const yearKey = (y: string) => Number((y.match(/\d{4}/) ?? ["0"])[0]);

export function getAllWork(): CaseStudy[] {
  return readDir<CaseStudy>("work").sort((a, b) => yearKey(b.year) - yearKey(a.year));
}

export function getFeaturedWork(): CaseStudy[] {
  return getAllWork()
    .filter((c) => c.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));
}

/** Image for a case: a supplied still first, then the YouTube thumbnail, else nothing. */
export function caseImage(c: CaseStudy): { src: string; alt: string } | null {
  const alt = c.image?.alt ?? `${c.client}: ${c.project}`;
  if (c.image?.src) return { src: c.image.src, alt };
  if (c.media?.platform === "youtube" && c.media.id) {
    return { src: `https://i.ytimg.com/vi/${c.media.id}/maxresdefault.jpg`, alt };
  }
  return null;
}

/* ---------- Photography ---------- */

export type PhotoProject = {
  slug: string;
  body: string;
  title: string;
  order: number;
  homepageLead?: boolean;
  images: { file: string; alt: string; src?: string; width?: number; height?: number }[];
};

/** Reads each photo's real pixel size so it is always shown at its original aspect ratio. */
export function getPhotoProjects(): PhotoProject[] {
  return readDir<PhotoProject>("photography")
    .map((p) => ({
      ...p,
      images: (p.images ?? [])
        .map((img) => {
          const file = path.join(process.cwd(), "public", "images", "photography", p.slug, img.file);
          if (!fs.existsSync(file)) return null;
          const { width, height } = imageSize(fs.readFileSync(file));
          return { ...img, src: `/images/photography/${p.slug}/${img.file}`, width, height };
        })
        .filter((x): x is NonNullable<typeof x> => x !== null),
    }))
    .sort((a, b) => a.order - b.order);
}

/* ---------- Pages ---------- */

export function getPage<T>(name: string): T & { body: string } {
  const raw = fs.readFileSync(path.join(CONTENT, "pages", `${name}.mdx`), "utf8");
  const { data, content } = matter(raw);
  return { ...(data as T), body: content.trim() };
}
