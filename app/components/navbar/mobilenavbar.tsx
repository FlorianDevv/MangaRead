"use client";
import { CircleUser, Home, Search, Tv } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
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
			? "flex flex-col items-center opacity-100"
			: "flex flex-col items-center opacity-80";
	};
	const language = process.env.DEFAULT_LANGUAGE;
	const data = require(`@/locales/${language}.json`);

	return (
		<>
			<div className={`${isVisible ? "pb-36 md:pb-0" : ""}`}>{children}</div>
			<nav
				className={`dark:bg-black bg-white p-2 shadow-md border-t dark:border-white border-black border-opacity-50 fixed bottom-0 w-full flex items-center justify-around md:hidden z-50 transition-all duration-300 ease-in-out transform ${
					isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
				} pb-6`}
			>
				<Link href="/">
					<Button variant="ghost">
						<div className={linkClass("Home")}>
							<Home />
							<span className="mt-1 text-xs">{data.navbar.home}</span>
						</div>
					</Button>
				</Link>
				<Link href="/live">
					<Button variant="ghost">
						<div className={linkClass("Live")}>
							<Tv />
							<span className="mt-1 text-xs">Live</span>
						</div>
					</Button>
				</Link>
				<Link href="/search">
					<Button variant="ghost">
						<div className={linkClass("Search")}>
							<Search />
							<span className="mt-1 text-xs">{data.navbar.search}</span>
						</div>
					</Button>
				</Link>
				<Link href="/profil">
					<Button variant="ghost">
						<div className={linkClass("Profil")}>
							<CircleUser />
							<span className="mt-1 text-xs">{data.navbar.profil}</span>
						</div>
					</Button>
				</Link>
			</nav>
		</>
	);
}
