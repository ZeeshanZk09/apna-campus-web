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
  const res = await axios.get('https://apna-campus.netlify.app/api/posts');
  const posts = await res.data;
  return posts.map((p: any) => `/blog/${p.slug}`);
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
