"use client";
import type React from "react";
import { useContext } from "react";
import { NavbarContext } from "./navbarcontext";

interface VisibleWrapperProps {
	children: React.ReactNode;
}

const VisibleWrapper: React.FC<VisibleWrapperProps> = ({ children }) => {
	const { isVisible } = useContext(NavbarContext);

	if (!isVisible) {
		return null;
	}

	return <>{children}</>;
};

export default VisibleWrapper;
