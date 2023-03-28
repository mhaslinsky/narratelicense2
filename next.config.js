/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    USER: process.env.USER,
    DOMAIN: process.env.DOMAIN,
    PASSWORD: process.env.PASSWORD,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
