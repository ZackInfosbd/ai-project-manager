"use client";

import Link from "next/link";
import { ChartNoAxesCombined } from "lucide-react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignOutButton,
  UserButton,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  return (
    <div
      className={`p-4 flex justify-between items-center ${isHomePage ? "bg-blue-50" : "bg-white border-b border-blue-50"}`}
    >
      <Link href="/" className="flex items-center">
        <ChartNoAxesCombined className="w-6 h-6 text-blue-500 mr-2" />
        <h1 className="text-xl font-semibold">Primeroute</h1>
      </Link>
      <div className="flex items-center space-x-4">
        <SignedIn>
          <Link href="/projects">
            <Button variant="outline">My Projects</Button>
          </Link>
          <Link href="/manage-plan">
            <Button>plan</Button>
          </Link>
          <SignOutButton>
            <UserButton />
          </SignOutButton>
        </SignedIn>
        <SignedOut>
          <SignInButton mode="modal">
            <Button>Login</Button>
          </SignInButton>
        </SignedOut>
      </div>
    </div>
  );
};
export default Header;
