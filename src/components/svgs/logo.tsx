import Image from "next/image";
import LogoImage from "../../app/favicon.ico"

interface LogoProps {
  className?: string;
}

export default function Logo({ className }: LogoProps) {
  return (
    <Image
      src={LogoImage}
      alt="Neurolab Logo"
      sizes="100vw"
      className={`w-auto h-auto ${className}`}
      width={0}
      height={0}
      priority
    />
  );
}
