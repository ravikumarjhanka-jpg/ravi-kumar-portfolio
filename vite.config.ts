import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * SEO plugin: when VITE_SITE_URL is set (e.g. https://ravikumar.in), injects the canonical URL and
 * absolute Open Graph image, and emits sitemap.xml. robots.txt is always emitted.
 */
function seo(siteUrl: string): Plugin {
  const url = siteUrl.replace(/\/$/, '');
  return {
    name: 'ravi-seo',
    transformIndexHtml(html) {
      if (!url) return html.replace('<!--canonical-->', '');
      return html
        .replace('<!--canonical-->', `<link rel="canonical" href="${url}/" />\n    <meta property="og:url" content="${url}/" />`)
        .replace(/content="ravi\/hero-poster\.webp"/g, `content="${url}/ravi/hero-poster.webp"`);
    },
    generateBundle() {
      const robots = `User-agent: *\nAllow: /\n${url ? `Sitemap: ${url}/sitemap.xml\n` : ''}`;
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: robots });
      if (url) {
        const today = new Date().toISOString().slice(0, 10);
        this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${url}/</loc><lastmod>${today}</lastmod><priority>1.0</priority></url>\n</urlset>\n` });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), seo(env.VITE_SITE_URL || '')],
    base: './',
    build: {
      target: 'es2020',
      rollupOptions: { output: { manualChunks: { motion: ['gsap', 'lenis'] } } },
    },
  };
});
