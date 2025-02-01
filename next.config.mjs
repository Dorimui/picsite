/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['localhost','i.dorimu.online','d.dorimu.cn'],
    },
    experimental: {
        appDir: true,
      },
};

export default nextConfig;
