import { readFile, readdir, access } from 'node:fs/promises';
import { join } from 'node:path';
import assert from 'node:assert/strict';
const directory = process.argv[3] || 'dist';
const production = process.argv[2] === 'production';
for (const path of ['index.html', 'privacy/index.html']) {
  const html = await readFile(join(directory, path), 'utf8');
  assert(html.includes(`content="${production ? 'index,follow' : 'noindex,nofollow'}"`), path);
  const url = `https://connect-mkt.jp/${path.startsWith('privacy') ? 'privacy/' : ''}`;
  assert(html.includes(`rel="canonical" href="${url}"`), path);
  assert(html.includes(`property="og:url" content="${url}"`), path);
}
for (const path of ['en/index.html', 'assets/gifts/8sns-ai-prompt-2026.html']) {
  assert(/name="robots" content="noindex,\s*nofollow"/.test(await readFile(join(directory, path), 'utf8')), path);
}
await assert.rejects(access(join(directory, 'mcp.json')));
async function scan(dir) {
  for (const entry of await readdir(dir, {withFileTypes:true})) {
    const path=join(dir,entry.name);
    if(entry.isDirectory()) await scan(path);
    else if(/\.(html|json|xml|js|css|txt)$/.test(path)) assert(!/mcp-server|mcp\.json|webmcp_standard_v1_active|WebMCP Protocol Active/i.test(await readFile(path,'utf8')), path);
  }
}
await scan(directory);
const sitemap=await readFile(join(directory,'sitemap.xml'),'utf8');
assert.equal((sitemap.match(/<loc>/g)||[]).length,production?2:0);
assert(!sitemap.includes('/en/')&&!sitemap.includes('/assets/'));
const robots=await readFile(join(directory,'robots.txt'),'utf8');
assert(production?robots.includes('Sitemap: https://connect-mkt.jp/sitemap.xml'):robots.includes('Disallow: /'));
console.log(`Verified ${production?'production':'preview'} output: ${directory}`);
