"use client";

import React from "react";
import { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

const Navbar = () => {
  const { data: session } = useSession();
  const user = session?.user as User;
  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center z-50">
        <a href="#" className="text-xl font-bold mb-4 md:mb-0 z-50">
          Mystry Messenger
        </a>
        {session ? (
          <>
            <span className="mr-4 z-50">
              Welcome {user?.username || user?.email}
            </span>
            <Button
              className="w-full md:w-auto bg-orange-400 hover:bg-orange-600 text-white z-50"
              onClick={() => signOut()}
            >
              Logout
            </Button>
          </>
        ) : (
          <Link href="/sign-in" className="z-50">
            <Button className="w-full md:w-auto bg-orange-400 hover:bg-orange-600 text-white z-50">
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
