import { execFileSync } from 'node:child_process';
import { readFile, writeFile, mkdir, cp, rm, access } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const baseline='342b0303f5d61c33d354f1d77b8cd2b91d05efab';
const release=resolve(process.argv[2]||'dist');
const output=resolve('rollback');
assert.notEqual(release,output);
const privacy=await readFile(`${release}/privacy/index.html`,'utf8');
assert(privacy.includes('個人情報の保存期間'));
await rm(output,{recursive:true,force:true});await mkdir(output,{recursive:true});
let html=execFileSync('git',['show',`${baseline}:index.html`],{encoding:'utf8'});
// Restore the old visual page without rediscovering an unverified MCP endpoint.
html=html.replace(/<link[^>]+rel="mcp-server"[^>]*>/g,'')
  .replace(/<section id="mcp"[\s\S]*?<\/section>/g,'')
  .replace(/<a\b[^>]*href="(?:#mcp|https:\/\/connect-mkt\.jp\/mcp\.json)"[^>]*>[\s\S]*?<\/a>/g,'')
  .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g,'');
html=html.replace('</head>','<meta name="robots" content="noindex,nofollow"></head>')
 .replace('</footer>','<p style="padding:20px;text-align:center"><a href="/privacy/">プライバシーポリシー</a> · <a href="https://tally.so/r/EqkyYX">正式お問い合わせフォーム</a></p></footer>');
assert(!/mcp-server|mcp\.json|WebMCP Protocol Active/i.test(html));
await writeFile(`${output}/index.html`,html);
for(const name of ['privacy','_astro','favicon.svg','ogp.png','en','assets'])await cp(`${release}/${name}`,`${output}/${name}`,{recursive:true});
await writeFile(`${output}/privacy/index.html`,privacy.replace('content="index,follow"','content="noindex,nofollow"'));
await writeFile(`${output}/robots.txt`,'User-agent: *\nDisallow: /\n');
await writeFile(`${output}/sitemap.xml`,'<?xml version="1.0"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
for (const match of privacy.matchAll(/(?:href|src)="(\/_astro\/[^"]+)"/g)) await access(`${output}${match[1]}`);
assert((await readFile(`${output}/privacy/index.html`, 'utf8')).includes('content="noindex,nofollow"'));
assert((await readFile(`${output}/index.html`, 'utf8')).includes('href="/privacy/"'));
await assert.rejects(access(`${output}/mcp.json`));
await writeFile(`${output}/rollback-manifest.json`, JSON.stringify({ baseline, privacyRetained: true, mcpDeclarationExcluded: true }, null, 2));
console.log(`Prepared rollback site from ${baseline}, with current privacy/assets and MCP discovery removed: ${output}`);
