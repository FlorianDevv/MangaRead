import {
  localePrefix,
  locales,
  pathnames,
} from "@/src/app/components/navigation";
import createMiddleware from "next-intl/middleware";
export default createMiddleware({
  defaultLocale: "fr",
  localeDetection: true,
  locales,
  localePrefix,
  pathnames,
});

export const config = {
  // Match only internationalized pathnames
  matcher: ["/", "/(fr|en)/:path*"],
};
