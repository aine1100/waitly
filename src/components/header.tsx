"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import { useScroll } from "~/hooks/use-scroll";
import { Button } from "./ui/button";
import Link from "next/link";
import TrackOrderModal from "./track-order-modal";

export default function Header() {
	const scrolled = useScroll();
	const [open, setOpen] = useState(false);

	return (
		<header
			className={cn(
				"py-4 flex flex-row gap-2 justify-between items-center md:px-10 sm:px-6 px-4 sticky top-0 z-50",
				scrolled &&
					"bg-background/50 md:bg-transparent md:backdrop-blur-none backdrop-blur-sm",
			)}
		>
			<div className="flex items-center gap-3">
				<Link href="/" className="font-semibold text-foreground">Neurolab</Link>
			</div>
			<div className="flex items-center gap-2">
				<Button
					variant="default"
					className="bg-blue-500 hover:bg-blue-600 text-white"
					onClick={() => setOpen(true)}
				>
					Track order
				</Button>
			</div>
			<TrackOrderModal open={open} onClose={() => setOpen(false)} />
		</header>
	);
}
