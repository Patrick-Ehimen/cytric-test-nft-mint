"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAccount } from "wagmi";
import Image from "next/image";

interface NFTData {
  nftId: number;
  name: string;
  description: string;
  logoUrl: string;
}

// Fallback image URL if logo fails to load
const fallbackImage = "../public/assets/Image.jpeg";

const NFTGallery = () => {
  const { address: userWalletAddress } = useAccount();
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [loading, setLoading] = useState(true);

  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!userWalletAddress) return;

    const fetchNFTs = async () => {
      try {
        const response = await axios.get(
          `https://nft-mint-deployment.onrender.com/api/nft/gallery/${userWalletAddress}`
        );
        console.log("Fetched NFTs:", response.data);
        setNfts(response.data);
      } catch (error) {
        console.error("Error fetching NFTs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNFTs();
  }, [userWalletAddress]);

  if (!userWalletAddress)
    return (
      <div className="flex items-center justify-center">
        <p className="text-[20px] my-5 my-5 text-white mx-[20px]">
          Please connect your wallet, to see your gallery.
        </p>
      </div>
    );

  if (loading) return <p>Loading...</p>;

  if (nfts.length === 0) {
    return (
      <p>No NFTs found, please mint your first one using the widget above.</p>
    );
  }

  if (!hasMounted) return null;

  return (
    <div className="nft-gallery flex flex-wrap gap-4">
      {nfts.map((nft, index) => (
        <div
          key={index}
          className="nft-card ml-20 border border-white rounded-lg p-5 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-2"
        >
          <Image
            src={nft.logoUrl}
            alt={nft.name}
            width={300}
            height={200}
            className="w-full h-48 object-cover rounded mb-4"
            onError={(e) => {
              e.currentTarget.src = fallbackImage;
            }}
            loading="lazy"
          />
          <h3 className="text-white text-[12px]">{nft.name}</h3>
          <p className="text-slate-500">{nft.description}</p>
        </div>
      ))}
      <time dateTime="2016-10-25" suppressHydrationWarning />
    </div>
  );
};

export default NFTGallery;
