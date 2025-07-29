import Link from "next/link";
import Image from "next/image";

export default function Header({children,}: Readonly<{children: React.ReactNode;}>) {
  return (
    <div className="flex-1 w-full flex flex-col items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full flex justify-between items-center p-3 px-5 text-sm">
          <div className="flex flex-col p-5 flex">
            <Link href="/">
                <Image src="/logo.svg" alt="Scheddy" width={25} height={8} /> 
            </Link>
          </div>
        </div>
      </nav>
    </div>     
  );
}
