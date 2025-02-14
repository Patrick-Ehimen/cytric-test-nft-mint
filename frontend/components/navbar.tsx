import Image from "next/image";
// import { Button } from "@/components/ui/button";
import { Logo } from "@/public/assets";

import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Navbar() {
  return (
    <header className="w-full bg-black px-4 py-3 border-b">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Image src={Logo} width={40} height={40} alt="logo" />
        </div>
        {/* <Button className="bg-[#E559F9] hover:bg-[#E559F9]/90 text-white rounded-full px-6">
          Connect Wallet
        </Button> */}
        <ConnectButton
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
    </header>
  );
}
