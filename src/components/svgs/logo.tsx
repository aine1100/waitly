import Image from "next/image";

interface LogoProps {
	width?: number;
	height?: number;
	className?: string;
}

export default function Logo({ width = 48, height = 48, className }: LogoProps) {
	return (
		<Image
			src="/logo.png"
			alt="Neurolab Logo"
			width={width}
			height={height}
			className={className}
			priority
		/>
	);
}
