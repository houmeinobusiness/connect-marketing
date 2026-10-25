import { cp, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root = new URL('../../', import.meta.url);
const output = new URL('../dist/', import.meta.url);
await mkdir(output, { recursive: true });
for (const path of ['en', 'assets', 'mcp.json']) {
  await cp(fileURLToPath(new URL(path, root)), fileURLToPath(new URL(path, output)), { recursive: true });
}
console.log('Legacy /en/, /assets/, /mcp.json retained. Root CNAME is unchanged.');
