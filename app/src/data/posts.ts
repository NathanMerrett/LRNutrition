/**
 * The single integration point for blog content.
 *
 * Pages and components must import from here and never talk to the Sanity
 * client directly — that keeps the whole CMS dependency in one file.
 *
 * Everything here runs at build time only. The site is statically generated,
 * so no Sanity code or credentials reach the browser.
 */
import { createClient } from '@sanity/client';

const projectId = import.meta.env.PUBLIC_SANITY_PROJECT_ID;
const dataset = import.meta.env.PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    'Missing PUBLIC_SANITY_PROJECT_ID or PUBLIC_SANITY_DATASET. ' +
      'Copy app/.env.example to app/.env and fill them in.',
  );
}

const client = createClient({
  projectId,
  dataset,
  // Pinned so a future API change can't alter query results without us choosing it.
  apiVersion: '2024-10-01',
  // Deliberately NOT the CDN. The CDN can serve a stale response for a short
  // window after publishing, and our builds are triggered by a publish webhook —
  // using it would be the one thing guaranteed to miss the new post.
  useCdn: false,
});

/** A Sanity image reference, as returned by GROQ for an `image` field. */
export interface SanityImage {
  asset?: { _ref?: string };
  alt?: string;
  hotspot?: { x: number; y: number };
}

/** A block in a Portable Text array. Loosely typed — see PortableText.astro. */
export interface PortableTextBlock {
  _key?: string;
  _type: string;
  style?: string;
  listItem?: string;
  level?: number;
  children?: Array<{
    _key?: string;
    _type?: string;
    text?: string;
    marks?: string[];
  }>;
  markDefs?: Array<{ _key: string; _type: string; href?: string }>;
  [key: string]: unknown;
}

/** A post as shown in listings — no body. */
export interface PostSummary {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  publishedAt: string;
  readingTime?: number;
  mainImage?: SanityImage;
}

/** A full post, including its Portable Text body. */
export interface Post extends PostSummary {
  body?: PortableTextBlock[];
}

// `defined(slug.current)` skips drafts that have not been given a slug yet,
// which would otherwise build a page at /blog/undefined.
// Note: order() must come before any slice, or it sorts the already-sliced set.
const summaryFields = `
  _id,
  title,
  "slug": slug.current,
  summary,
  publishedAt,
  readingTime,
  mainImage
`;

const POSTS_QUERY = /* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    ${summaryFields}
  }
`;

const POST_QUERY = /* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    ${summaryFields},
    body
  }
`;

/** Every post, newest first. Returns `[]` when the dataset is empty. */
export async function getPosts(): Promise<PostSummary[]> {
  return (await client.fetch<PostSummary[]>(POSTS_QUERY)) ?? [];
}

/** The `n` most recent posts, for the homepage teaser. */
export async function getLatestPosts(n: number): Promise<PostSummary[]> {
  const posts = await getPosts();
  return posts.slice(0, n);
}

/** A single post by slug, or `null` if there is no such post. */
export async function getPost(slug: string): Promise<Post | null> {
  return (await client.fetch<Post | null>(POST_QUERY, { slug })) ?? null;
}

/** Format an ISO date as "1 May 2026". */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

interface ImageOptions {
  width?: number;
  height?: number;
}

/**
 * Build a CDN URL for a Sanity image.
 *
 * Normally this is `@sanity/image-url`'s job, but that dependency was declined,
 * so we parse the asset reference ourselves. A reference looks like:
 *
 *   image-2f4a1b...-1200x800-jpg
 *         └ asset id  └ w x h  └ format
 *
 * Returns `null` when there is no image, so callers can skip the <img> entirely
 * rather than rendering a broken one.
 */
export function imageUrl(
  source: SanityImage | undefined,
  { width, height }: ImageOptions = {},
): string | null {
  const ref = source?.asset?._ref;
  if (!ref) return null;

  const [, assetId, dimensions, format] = ref.split('-');
  if (!assetId || !dimensions || !format) return null;

  const params = new URLSearchParams();
  if (width) params.set('w', String(width));
  if (height) params.set('h', String(height));
  // Let Sanity serve WebP/AVIF to browsers that accept it.
  params.set('auto', 'format');

  // Respect the editor's chosen focal point when we crop to a fixed box.
  // This is what `hotspot: true` in the schema is for.
  if (width && height && source?.hotspot) {
    params.set('fit', 'crop');
    params.set('crop', 'focalpoint');
    params.set('fp-x', source.hotspot.x.toFixed(3));
    params.set('fp-y', source.hotspot.y.toFixed(3));
  }

  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${assetId}-${dimensions}.${format}?${params}`;
}
