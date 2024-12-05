/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['firebasestorage.googleapis.com', 'i.imghippo.com'],
    },
    webpack: (config) => {
        config.resolve.fallback = {
            ...config.resolve.fallback,
            module: false,
        };
        return config;
    },
};

export default nextConfig;
  