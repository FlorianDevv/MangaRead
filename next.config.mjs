/** @type {import('next').NextConfig} */

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  reloadOnOnline: true,
  cacheOnNavigation: true,
});

const nextConfig = {
  images: {
    formats: ["image/webp"],
  },
  env: {
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
    MAX_QUALITY: process.env.MAX_QUALITY,
    MIN_QUALITY: process.env.MIN_QUALITY,
    DEFAULT_QUALITY: process.env.DEFAULT_QUALITY,
  },
};

export default withSerwist(nextConfig);
