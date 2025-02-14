import React from "react";
import Header from "@/components/header";
import MintNFT from "@/components/mint-nft";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 to-black">
      <Header />
      <MintNFT />
    </div>
  );
}
