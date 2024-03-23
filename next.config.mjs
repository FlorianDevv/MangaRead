/** @type {import('next').NextConfig} */

import withSerwistInit from "@serwist/next";

const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
});

const nextConfig = {
  images: {
    formats: ["image/webp"],
    minimumCacheTTL: 60,
  },
};

export default withSerwist(nextConfig);
