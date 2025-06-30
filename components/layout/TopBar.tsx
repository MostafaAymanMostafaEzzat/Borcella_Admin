'use client';

import { navLinks } from "@/lib/constants";
import { UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";


export default function TopBar() {
    const [dropDownMenu, setdropDownMenu] = useState(false);
    const pathName = usePathname();

    return ( 
        <div className="flex  w-full bg-blue-2  sticky top-0 lg:hidden  px-8 py-4 justify-between items-center "> 
            <Image src="/logo.png" alt="logo" width={150} height={100} />
            <div className="flex gap-8  max-md:hidden ">
                {navLinks.map((link) => (
                    <Link key={link.label} href={link.url} className={`text-body-medium flex gap-4 ${pathName === link.url ? "text-blue-1" : "text-grey-1"}`}>
                       <p>{link.label}</p>
                    </Link>
                ))}
            </div>
            <div className=" relative flex gap-6 items-center ">
                <Menu size={34} className="cursor-pointer md:hidden" onClick={() => setdropDownMenu(!dropDownMenu)}/>
                    {dropDownMenu && (
                        <div className="absolute bg-white h-56 top-10 right-6 flex  gap-6 flex-col p-5 rounded-lg shadow-lg overflow-y-auto">
                            {navLinks.map((link) => (
                                <Link key={link.label} href={link.url} className={` text-body-medium flex gap-4 ${pathName === link.url ? "text-blue-1" : "text-grey-1"}`}>
                                { link.icon} <p>{link.label}</p>
                                </Link>
                            ))}
                            
                        </div>
                    )}

            <UserButton />
            </div>
        </div>
    )
}