import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({ site: 'https://connect-mkt.jp', base: '/', output: 'static', vite: { plugins: [tailwindcss()] } });
