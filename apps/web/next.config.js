/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@thoughtweaver/ui',
    '@thoughtweaver/types',
    '@thoughtweaver/sdk',
    '@thoughtweaver/config',
  ],
};

export default nextConfig;
