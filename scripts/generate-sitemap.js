const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://mon-domaine.com';
const rootDir = path.resolve(__dirname, '..');
const blogIndexPath = path.join(rootDir, 'src', 'assets', 'blog', 'index.json');
const sitemapPath = path.join(rootDir, 'src', 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);
const articles = JSON.parse(fs.readFileSync(blogIndexPath, 'utf8'));
const latestArticleDate = articles
  .map(article => article.updatedAt || article.date)
  .sort()
  .at(-1) || today;

const urls = [
  {
    loc: `${BASE_URL}/`,
    lastmod: latestArticleDate,
    changefreq: 'monthly',
    priority: '1.0',
  },
  {
    loc: `${BASE_URL}/blog`,
    lastmod: latestArticleDate,
    changefreq: 'weekly',
    priority: '0.8',
  },
  ...articles.map(article => ({
    loc: `${BASE_URL}/blog/${article.slug}`,
    lastmod: article.updatedAt || article.date || today,
    changefreq: 'monthly',
    priority: '0.7',
  })),
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${escapeXml(url.lastmod)}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;

fs.writeFileSync(sitemapPath, xml);
console.log(`Generated ${path.relative(rootDir, sitemapPath)} with ${urls.length} URLs.`);

function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
