import {
  createLocalizedPathnamesNavigation,
  Pathnames,
} from "next-intl/navigation";

export const locales = ["en", "fr"] as const;
export const localePrefix = "always"; // Default

// The `pathnames` object holds pairs of internal
// and external paths, separated by locale.
export const pathnames = {
  // "/manga": {
  //   en: "/en/manga",
  //   fr: "/fr/manga",
  // },
  // "/manga/[slug]": {
  //   en: "/en/manga/[slug]",
  //   fr: "/fr/manga/[slug]",
  // },
  // "/manga/[slug]/[volume]": {
  //   en: "/en/manga/[slug]/[volume]",
  //   fr: "/fr/manga/[slug]/[volume]",
  // },
} satisfies Pathnames<typeof locales>;

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createLocalizedPathnamesNavigation({ locales, localePrefix, pathnames });
