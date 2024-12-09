/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://chitramela.in',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
  changefreq: 'daily',
  priority: 0.7,
} 