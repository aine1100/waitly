import type { SVGProps } from "react";
import Logo from "./logo";

export default function Nextjs(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			aria-label="Next.js logotype"
			height="18"
			role="img"
			viewBox="0 0 394 79"
			{...props}
		>
			<title>Neurolab</title>
			<Logo/>
		</svg>
	);
}
