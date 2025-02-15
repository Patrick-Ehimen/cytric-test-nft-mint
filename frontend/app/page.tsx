import React from "react";
import Header from "@/components/header";
import MintNFT from "@/components/mint-nft";
// import MintWidget from "@/components/mint-widget";
// import NftMintWidget from "@/components/nft-mint-widget";

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 to-black">
      <Header />
      <MintNFT />
      {/* <MintWidget /> */}
      {/* <NftMintWidget /> */}
    </div>
  );
}
