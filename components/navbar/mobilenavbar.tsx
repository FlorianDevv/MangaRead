"use client";
import { CircleUser, Home, Search, Tv } from "lucide-react";
import Link from "next/link";

import { useContext } from "react";
import NavItem from "./navItem";
import { NavbarContext } from "./navbarcontext";
export function MobileNavbarComponent({
	children,
}: {
	children?: React.ReactNode;
}) {
	const { isVisible } = useContext(NavbarContext);

	// const language = process.env.DEFAULT_LANGUAGE;
	// const data = require(`@/locales/${language}.json`);

	return (
		<>
			<div className={`${isVisible ? "pb-36 md:pb-0" : ""}`}>{children}</div>
			<nav
				className={`dark:bg-black bg-white p-2 shadow-md border-t dark:border-white border-black border-opacity-50 fixed bottom-0 w-full flex items-center justify-around md:hidden z-50 transition-all duration-300 ease-in-out transform ${
					isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
				} pb-6`}
			>
				<Link href="/" className="flex flex-col items-center">
					<NavItem href={"/"}>
						<Home />
						{/* <span className="mt-1 text-xs">{data.navbar.home}</span> */}
					</NavItem>
				</Link>
				<Link href="/live" className="flex flex-col items-center">
					<NavItem href={"/live"}>
						<Tv />
						{/* <span className="mt-1 text-xs">Live</span> */}
					</NavItem>
				</Link>
				<Link href="/search" className="flex flex-col items-center">
					<NavItem href={"/search"}>
						<Search />
						{/* <span className="mt-1 text-xs">{data.navbar.search}</span> */}
					</NavItem>
				</Link>
				<Link href="/profil" className="flex flex-col items-center">
					<NavItem href={"/profil"}>
						<CircleUser />
						{/* <span className="mt-1 text-xs">{data.navbar.profil}</span> */}
					</NavItem>
				</Link>
			</nav>
		</>
	);
}
