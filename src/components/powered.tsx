import Image from "next/image";
import Link from "next/link";

export default function Powered() {
	return (
		<div className="flex flex-col items-center justify-center gap-12 py-12">
			<div className="flex flex-col items-center justify-center gap-2">
				<h3 className="text-foreground text-2xl font-semibold">Our Partners</h3>
				<p className="text-muted-foreground text-base">
					Trusted by leading organizations in neurotechnology and AI research.
				</p>
			</div>
			<div className="flex items-center justify-center sm:gap-12 gap-8 flex-wrap">
				<Link href="https://rca.ac.rw" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 hover:scale-105 transition-transform">
					<Image
						src="/rca.png"
						alt="Rwanda Coding Academy"
						width={80}
						height={80}
						className="opacity-70 hover:opacity-100 transition-opacity rounded-full object-cover"
					/>
					<p className="text-sm text-muted-foreground font-medium text-center">Rwanda Coding Academy</p>
				</Link>
				<Link href="https://benax.rw" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 hover:scale-105 transition-transform">
					<Image
						src="/benax.png"
						alt="Benax Technologies"
						width={80}
						height={80}
						className="opacity-70 hover:opacity-100 transition-opacity rounded-full object-cover"
					/>
					<p className="text-sm text-muted-foreground font-medium text-center">Benax Technologies</p>
				</Link>
				<Link href="https://sandtech.rw" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 hover:scale-105 transition-transform">
					<Image
						src="/sandtech.png"
						alt="Sand Technologies"
						width={80}
						height={80}
						className="opacity-70 hover:opacity-100 transition-opacity rounded-full object-cover"
					/>
					<p className="text-sm text-muted-foreground font-medium text-center">Sand Technologies</p>
				</Link>
				<Link href="https://neuralink.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 hover:scale-105 transition-transform">
					<Image
						src="/neuralink.png"
						alt="Neuralink"
						width={80}
						height={80}
						className="opacity-70 hover:opacity-100 transition-opacity rounded-full object-cover"
					/>
					<p className="text-sm text-muted-foreground font-medium text-center">Neuralink Team</p>
				</Link>
			</div>
		</div>
	);
}
