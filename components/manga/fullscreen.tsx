import { Maximize2, Minimize2 } from "lucide-react";
import { useContext } from "react";
import { NavbarContext } from "../navbar/navbarcontext";

interface FullscreenProps {
	isFullscreen: boolean;
	setIsFullscreen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Fullscreen({
	isFullscreen,
	setIsFullscreen,
}: FullscreenProps) {
	const { setIsVisible } = useContext(NavbarContext);

	const goFullScreen = () => {
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		}
		document.body.classList.add("fullscreen");
		setIsFullscreen(true);
		setIsVisible(false);
	};

	const exitFullScreen = () => {
		if (document.fullscreenElement && document.exitFullscreen) {
			document.exitFullscreen();
		}
		document.body.classList.remove("fullscreen");
		setIsFullscreen(false);
		setIsVisible(true);
	};

	return (
		<button
			type="button"
			className={
				"justify-center hover:scale-115 hover:opacity-75 transform transition-transform duration-300 "
			}
			onClick={isFullscreen ? exitFullScreen : goFullScreen}
			title="Fullscreen"
		>
			{isFullscreen ? <Minimize2 /> : <Maximize2 />}
		</button>
	);
}
