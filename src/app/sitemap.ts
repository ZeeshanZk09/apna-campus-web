import type { MetadataRoute } from 'next';
import db from '@/lib/prisma';

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
    const posts = await db.post.findMany({
      select: { slug: true },
      take: 200,
    });
    return posts.map((p) => `/blog/${p.slug}`);
  } catch (err) {
    console.error('Failed to fetch posts for sitemap:', err);
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
