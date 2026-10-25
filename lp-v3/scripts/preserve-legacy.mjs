import { cp, mkdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../../', import.meta.url);
const output = new URL('../dist/', import.meta.url);
await mkdir(output, { recursive: true });
// Only the revised English page and the existing gift are approved legacy URLs.
for (const path of ['en', 'assets']) {
  await cp(fileURLToPath(new URL(path, root)), fileURLToPath(new URL(path, output)), { recursive: true });
}
// Defensive cleanup: an earlier local build must not leave the old declaration.
await rm(new URL('mcp.json', output), { force: true });
console.log('Revised /en/ and existing /assets/ retained; MCP declaration excluded. CNAME unchanged.');
