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
  /** Link text on the Work index, e.g. "Watch Vet Tech Week". Defaults to "Watch". */
  label?: string;
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
  extraMedia?: Media[];
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

const WORK_IMAGES = path.join(process.cwd(), "public", "images", "work");

async function oembedThumb(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "force-cache", signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: string };
    if (!data.thumbnail_url) return null;
    let thumb = data.thumbnail_url;
    // Spotify: ask for the 640px album art rather than the 300px default.
    if (thumb.includes("i.scdn.co")) thumb = thumb.replace("ab67616d00001e02", "ab67616d0000b273");
    // Vimeo: ask for a full-width frame.
    if (thumb.includes("vimeocdn.com")) thumb = thumb.replace(/_\d+x\d+/, "_1280x720");
    return thumb;
  } catch {
    return null; // Offline builds fall back to the typographic frame.
  }
}

/**
 * Image for a case, in order of preference:
 * 1. a still you supply (image.src, or /public/images/work/<slug>.jpg)
 * 2. the YouTube thumbnail
 * 3. the Vimeo thumbnail or Spotify album art, looked up when the site is built
 * Returns null only if none is available; the card then shows a typographic frame.
 */
export type CaseImage = { src: string; alt: string; fit?: "cover" | "contain" };

export async function caseImage(c: CaseStudy): Promise<CaseImage | null> {
  const alt = c.image?.alt ?? `${c.client}: ${c.project}`;
  // Album art is square: always shown whole inside the frame, never cropped.
  const fit = c.media?.platform === "spotify" ? "contain" : "cover";
  if (c.image?.src && fs.existsSync(path.join(process.cwd(), "public", c.image.src))) {
    return { src: c.image.src, alt, fit };
  }
  for (const ext of ["jpg", "jpeg", "png", "webp"]) {
    if (fs.existsSync(path.join(WORK_IMAGES, `${c.slug}.${ext}`))) {
      return { src: `/images/work/${c.slug}.${ext}`, alt, fit };
    }
  }
  const m = c.media;
  if (!m?.id) return null;
  if (m.platform === "youtube") return { src: `https://i.ytimg.com/vi/${m.id}/maxresdefault.jpg`, alt };
  if (m.platform === "vimeo") {
    const t = await oembedThumb(`https://vimeo.com/api/oembed.json?url=https://vimeo.com/${m.id}`);
    return t ? { src: t, alt } : null;
  }
  if (m.platform === "spotify") {
    const t = await oembedThumb(`https://open.spotify.com/oembed?url=https://open.spotify.com/album/${m.id}`);
    // Album art is square: shown whole inside the frame, never cropped.
    return t ? { src: t, alt, fit: "contain" } : null;
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
