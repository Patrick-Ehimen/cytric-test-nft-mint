"use client";

import React from "react";
import Header from "@/components/header";
import MintNFT from "@/components/mint-nft";
// import NFTGallery from "@/components/nft-gallery";

import dynamic from "next/dynamic";
const NFTGallery = dynamic(() => import("@/components/nft-gallery"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="bg-gradient-to-b from-slate-950 to-black">
      <Header />
      <MintNFT />
      <NFTGallery />
    </div>
  );
}
