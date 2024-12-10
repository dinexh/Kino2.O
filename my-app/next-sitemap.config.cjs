/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://chitramela.in',
  generateRobotsTxt: true,
  changefreq: 'daily',
  priority: 1.0,
  sitemapSize: 7000,
  exclude: ['/server-sitemap.xml'],
  robotsTxtOptions: {
    additionalSitemaps: [
      'https://chitramela.in/server-sitemap.xml',
    ],
    policies: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/private', '/admin'],
      },
    ],
  },
} 