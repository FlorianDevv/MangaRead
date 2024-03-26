import { localePrefix, locales } from "@/src/app/navigation";
import createMiddleware from "next-intl/middleware";
export default createMiddleware({
  defaultLocale: "fr",
  localeDetection: true,
  locales,
  localePrefix,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en)/:path*"],
};
