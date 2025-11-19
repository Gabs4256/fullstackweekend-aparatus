"use client";

import Image from "next/image";
import { Button } from "./ui/button";
import { LogInIcon, LogOutIcon, MenuIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import SidebarMenu from "./sidebar-menu";

const Header = () => {
  const { data: session } = authClient.useSession();
  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };
  return (
    <header className="flex items-center justify-between bg-white px-5 py-6">
      <Image src="/logo.svg" alt="Aparatus" width={100} height={26.09} />
      <div className="flex items-center gap-2">
        {session ? (
          <div>
            <h1>{session.user?.name}</h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => authClient.signOut()}
            >
              <LogOutIcon />
            </Button>
          </div>
        ) : (
          <Button variant="outline" size="icon" onClick={handleLogin}>
            <LogInIcon />
          </Button>
        )}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[370px] p-4">
            <SheetHeader className="border-b px-5 py-6 text-left">
              <SheetTitle className="text-lg font-bold">Menu</SheetTitle>
            </SheetHeader>
            <SidebarMenu />
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;