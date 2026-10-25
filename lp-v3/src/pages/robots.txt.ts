import { isPublicBuild } from '../lib/indexing';
export const prerender = true;
export function GET() {
  const text = isPublicBuild
    ? 'User-agent: *\nAllow: /\nSitemap: https://connect-mkt.jp/sitemap.xml\n'
    : 'User-agent: *\nDisallow: /\n';
  return new Response(text, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
