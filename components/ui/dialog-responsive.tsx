"use client";
// Primitives are CLI-installed by default, but @radix-ui can also be used
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import type { PropsWithChildren } from "react";

import { useMediaQuery } from "@/components/hooks/use-media-query";
import { MOTION, STYLES } from "@/components/ui/_shared";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@/components/ui/drawer";
import { clx } from "@/lib/utils/clx/clx-merge";

const DialogPortal = DialogPrimitive.Portal;
const BaseDialog = DialogPrimitive.Root;
const BaseDialogTrigger = DialogPrimitive.Trigger;
const BaseDialogClose = DialogPrimitive.Close;

const BaseDialogHeader = clx.div(STYLES.FLEX_COL, "items-center space-y-1.5");
const BaseDialogFooter = clx.div(
	"flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
);
const BaseDialogTitle = clx(
	DialogPrimitive.Title,
	"text-lg font-semibold leading-none tracking-tight",
);
const BaseDialogDescription = clx(
	DialogPrimitive.Description,
	"text-sm text-muted-foreground",
);
const DialogOverlay = clx(
	DialogPrimitive.Overlay,
	MOTION.ANIMATE_IN,
	MOTION.ANIMATE_OUT,
	MOTION.FADE_IN_OUT,
	"fixed inset-0 z-50 bg-black/80 ",
);

const DialogRoot = clx(
	DialogPrimitive.Content,
	MOTION.ANIMATE_IN,
	MOTION.ANIMATE_OUT,
	MOTION.FADE_IN_OUT,
	MOTION.ZOOM_IN_OUT,
	MOTION.DIALOG_SLIDE_IN_OUT,
	"translate-x-[-50%] translate-y-[-50%]",
	"z-50 fixed left-[50%] top-[50%]",
	"grid w-full gap-4 p-6",
	"max-w-lg bg-background shadow-lg duration-200 sm:rounded-lg",
);

const DialogCloseRoot = clx(
	DialogPrimitive.Close,
	STYLES.OFFSET_BG,
	STYLES.RING_FOCUS,
	"data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
	"absolute right-2 top-2 rounded-sm opacity-70 transition-opacity hover:opacity-100 disabled:pointer-events-none",
);

function BaseDialogContent({
	children,
	...props
}: PropsWithChildren<
	React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>) {
	return (
		<DialogPortal>
			<DialogOverlay />
			<DialogRoot {...props}>
				{children}
				<DialogCloseRoot>
					<X size={32} />
					<span className="sr-only">Close</span>
				</DialogCloseRoot>
			</DialogRoot>
		</DialogPortal>
	);
}

//

//

/*´:°•.°+.*•´.*:˚.°*.˚•´.°:°•.°•.*•´.*:˚.°*.˚•´.°:°•.°+.*•´.*:*/
/*                        RESPONSIVE                          */
/*.•°:°.´+˚.*°.˚:*.´•*.+°.•°:´*.´•*.•°.•°:°.´:•˚°.*°.˚:*.´+°.•*/

const DESKTOP_WIDTH = "(min-width: 768px)";

interface RootDialogProps extends PropsWithChildren {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

interface DialogProps extends PropsWithChildren {
	className?: string;
	asChild?: true;
}

const Dialog = ({ children, ...props }: RootDialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const Dialog = isDesktop ? BaseDialog : Drawer;

	return <Dialog {...props}>{children}</Dialog>;
};

const DialogTrigger = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogTrigger = isDesktop ? BaseDialogTrigger : DrawerTrigger;

	return (
		<DialogTrigger className={className} {...props}>
			{children}
		</DialogTrigger>
	);
};

const DialogClose = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogClose = isDesktop ? BaseDialogClose : DrawerClose;

	return (
		<DialogClose className={className} {...props}>
			{children}
		</DialogClose>
	);
};

const DialogContent = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogContent = isDesktop ? BaseDialogContent : DrawerContent;

	return (
		<DialogContent className={className} {...props}>
			{children}
		</DialogContent>
	);
};

const DialogDescription = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogDescription = isDesktop
		? BaseDialogDescription
		: DrawerDescription;

	return (
		<DialogDescription className={className} {...props}>
			{children}
		</DialogDescription>
	);
};

const DialogHeader = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogHeader = isDesktop ? BaseDialogHeader : DrawerHeader;

	return (
		<DialogHeader className={className} {...props}>
			{children}
		</DialogHeader>
	);
};

const DialogTitle = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogTitle = isDesktop ? BaseDialogTitle : DrawerTitle;

	return (
		<DialogTitle className={className} {...props}>
			{children}
		</DialogTitle>
	);
};

const DialogFooter = ({ className, children, ...props }: DialogProps) => {
	const isDesktop = useMediaQuery(DESKTOP_WIDTH);
	const DialogFooter = isDesktop ? BaseDialogFooter : DrawerFooter;

	return (
		<DialogFooter className={className} {...props}>
			{children}
		</DialogFooter>
	);
};

const DialogBody = clx.div("px-4 md:px-0");

// const DialogBody = ({ className, children, ...props }: DialogProps) => {
//   return (
//     <div className={cn("px-4 md:px-0", className)} {...props}>
//       {children}
//     </div>
//   );
// };

export {
	Dialog,
	DialogBody,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
};
