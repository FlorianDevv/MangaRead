"use client";
import { CircleUser, Home, Search } from "lucide-react";
import Link from "next/link";

import { useContext } from "react";
import { NavbarContext } from "./navbarcontext";
export function MobileNavbarComponent({
  activePage,
  children,
}: {
  activePage?: string;
  children?: React.ReactNode;
}) {
  const { isVisible } = useContext(NavbarContext);

  const linkClass = (page: string) => {
    return activePage === page
      ? "flex flex-col items-center text-blue-500 hover:opacity-75 duration-200 ease-in-out transition-opacity "
      : "flex flex-col items-center text-white hover:opacity-75 duration-200 ease-in-out transition-opacity";
  };

  return (
    <>
      <div className={`${isVisible ? "pb-36" : ""}`}>{children}</div>
      <nav
        className={`bg-black p-2 shadow-md border-t-2 border-sky-600 fixed bottom-0 w-full flex items-center justify-around md:hidden z-50 ${
          !isVisible ? "hidden" : ""
        } pb-6`}
      >
        <Link href="/">
          <div className={linkClass("Home")}>
            <Home />
            <span className="mt-1 text-xs">Accueil</span>
          </div>
        </Link>
        <Link href="/search">
          <div className={linkClass("Search")}>
            <Search />
            <span className="mt-1 text-xs">Recherche</span>
          </div>
        </Link>
        <Link href="/profil">
          <div className={linkClass("Profil")}>
            <CircleUser />
            <span className="mt-1 text-xs">Profil</span>
          </div>
        </Link>
      </nav>
    </>
  );
}
