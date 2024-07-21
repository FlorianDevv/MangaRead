"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItemProps {
	href: string;
	children: React.ReactNode;
}

export default function NavItem({ href, children }: NavItemProps) {
	const pathname = usePathname();
	const isActive = pathname === href;

	return (
		<Link
			href={href}
			className={`flex transition-colors hover:text-foreground/80 ${
				isActive ? "text-foreground" : "text-foreground/60"
			} mr-4 lg:mr-8`}
		>
			<Button variant="ghost">{children}</Button>
		</Link>
	);
}
