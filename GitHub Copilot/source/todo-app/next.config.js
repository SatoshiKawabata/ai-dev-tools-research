module.exports = {
  reactStrictMode: true,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  images: {
    domains: ['example.com'], // Add your image domains here
  },
};