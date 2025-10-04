import axios from 'axios';
import { MetadataRoute } from 'next';

const baseUrl = 'https://apna-campus.netlify.app';

function getStaticPaths(): string[] {
  // manually or programmatically generate list of all page paths
  const paths = [
    '/',
    '/about',
    '/contact',
    '/faqs',
    '/testimonials',
    '/login',
    '/register',
    '/profile',
    '/admin/dashboard',
    '/courses',
    '/blog',
    '/privacy-policy',
    '/terms',
  ];
  return paths;
}

async function getDynamicSlugs(): Promise<string[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/posts`,
      {
        // 👇 prevents Next.js from trying to prerender stale data
        cache: 'no-store',
      }
    );
    if (!res.ok) return [];
    const posts = await res.json();
    return posts.map((p: any) => `/blog/${p.slug}`);
  } catch (err) {
    console.error('Failed to fetch posts:', err);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPaths = getStaticPaths();
  const dynamicPaths = await getDynamicSlugs();
  const allPaths = [...staticPaths, ...dynamicPaths];

  return allPaths.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: path === '/' ? 1 : 0.7,
  }));
}
