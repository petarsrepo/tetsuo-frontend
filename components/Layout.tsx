"use client";

import type { FC, ReactNode } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Wallet, MessageCircle, Wrench, Smile } from "lucide-react";
import Logo from "@/app/images/logo.webp";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { usePathname } from "next/navigation";
import { ThemeDropdown } from "./ThemeDropdown";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  const pathname = usePathname();
  const tab = pathname.split("/")?.[1] || "finance";

  return (
    <div className="min-h-screen pb-20 flex flex-col">
      <header className="flex justify-between items-center p-4">
        <a href="/finance">
          <img
            src={Logo.src}
            alt="Tetsuo"
            className="w-14"
            width={Logo.width}
            height={Logo.height}
          />
        </a>
        <div className="flex items-center gap-2">
          <ThemeDropdown />
          <WalletMultiButton />
        </div>
      </header>
      <main className="p-4 flex-1 h-full">{children}</main>
      <footer className="fixed bottom-0 left-0 right-0 bg-gray-100 flex items-center justify-center">
        <Tabs defaultValue={tab} className="w-full h-full rounded-none">
          <TabsList className="w-full h-full rounded-none">
            <TabsTrigger value="finance" className="w-1/4" asChild>
              <Link href="/finance" className="flex flex-col items-center">
                <Wallet size={20} />
                <span className="text-xs">Finance</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="chat" className="w-1/4" asChild>
              <Link href="/chat" className="flex flex-col items-center">
                <MessageCircle size={20} />
                <span className="text-xs">Chat</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="tools" className="w-1/4" asChild>
              <Link href="/tools" className="flex flex-col items-center">
                <Wrench size={20} />
                <span className="text-xs">Tools</span>
              </Link>
            </TabsTrigger>
            <TabsTrigger value="fun" className="w-1/4" asChild>
              <Link href="/fun" className="flex flex-col items-center">
                <Smile size={20} />
                <span className="text-xs">Fun</span>
              </Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </footer>
    </div>
  );
};
