/** @type {import('next').NextConfig} */

import withPlaiceholder from "@plaiceholder/next";
import withSerwistInit from "@serwist/next";
// import pkg from "./package.json" assert { type: "json" };
// const { version } = pkg;
const isBuild = process.env.NODE_ENV === "production";
const withSerwist = withSerwistInit({
  // Note: This is only an example. If you use Pages Router,
  // use something else that works, such as "service-worker/index.ts".
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  disablePrecacheManifest: isBuild,
  disablePrecacheManifest: true, // Put 2 disable idk if one works or not so put both to be sure
  maximumFileSizeToCacheInBytes: 10000,
});

const nextConfig = {
  images: {
    formats: ["image/webp"],
  },
  env: {
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE,
  },
};

export default withSerwist(withPlaiceholder(nextConfig));
