import Link from "next/link";

export default function Footer() {
  return (
    <footer className="flex flex-col justify-center items-center gap-4 pb-4">
      <div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Built by{" "}
          <Link href="https://neurolab.cc" target="_blank" className="font-semibold text-foreground">Neurolab Team</Link>
        </p>
      </div>
    </footer>
  );
}
