/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'ddragon.leagueoflegends.com',       // Data Dragon — champion, item, trait images
      'raw.communitydragon.org',            // Community Dragon — fallback item images
      'cdn-icons-png.flaticon.com',         // Footer social icons
      'storage.ko-fi.com',                  // Footer Ko-fi button
    ],
  },
};

module.exports = nextConfig;
