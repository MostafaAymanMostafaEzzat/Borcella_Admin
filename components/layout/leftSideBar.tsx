'use client';
import Image from "next/image";

 import { navLinks } from "@/lib/constants";
import { UserButton, UserProfile } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
 export default function LeftSideBar() {
    const pathName = usePathname();
    return ( 
        <div className="flex flex-col items-center  xl:h-screen bg-blue-2 gap-16 sticky top-0 left-0 max-lg:hidden p-10 h-full"> 
            <Image src="/logo.png" alt="logo" width={150} height={100} />
            <div className="flex flex-col  gap-12 font-bold ">
                {navLinks.map((link) => (
                    <Link key={link.label} href={link.url} className={`text-body-medium flex gap-4 ${pathName === link.url ? "text-blue-1" : "text-grey-1"}`}>
                      {link.icon}  <p>{link.label}</p>
                    </Link>
                ))}
            </div>
            <div className="flex gap-6 text-body-medium items-center ">
            <UserButton />
            <p>Edit Profile</p>
            </div>
        </div>
    )
 }
