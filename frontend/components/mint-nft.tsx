"use client";

import React, { useState, useEffect } from "react";
import { Check, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import contractABI from "././../constants/nftContractAbi.json";

interface NFTData {
  nftId: number;
  name: string;
  description: string;
  logoUrl: string;
  userWalletAddress: string;
}

const contractAddress = "0x743f49311a82fe72eb474c44e78da2a6e0ae951c";

export default function MintNFT() {
  const { address, isConnected } = useAccount();
  const { writeContract } = useWriteContract();
  const [tokenId, setTokenId] = useState<number>(0);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);
  console.log(isUnique);

  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<
    Omit<NFTData, "nftId" | "userWalletAddress">
  >({
    name: "",
    description: "",
    logoUrl: "",
  });
  const [storedNFT, setStoredNFT] = useState<NFTData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Generate a random token ID (number between 1 and 1,000,000)
  const generateRandomTokenId = (): number => {
    return Math.floor(Math.random() * 1_000_000) + 1;
  };

  const handleReset = () => {
    setFormData({
      name: "",
      description: "",
      logoUrl: "",
    });
    setTokenId(generateRandomTokenId());
    setIsSuccess(false);
    setStoredNFT(null);
    setError(null);
  };

  const { data, refetch, isLoading } = useReadContract({
    abi: contractABI,
    address: contractAddress,
    functionName: "checkId",
    args: [tokenId],
    // enabled: tokenId !== 0,
  });

  // On mount, generate an initial tokenId if not set
  useEffect(() => {
    if (tokenId === 0) {
      setTokenId(generateRandomTokenId());
    }
  }, [tokenId]);

  useEffect(() => {
    if (tokenId === 0 || isLoading) return;

    // Expect data to be a boolean:
    // true => an NFT with this tokenId exists
    // false => no NFT with this tokenId exists
    if (data === false) {
      setIsUnique(true);
    } else {
      setIsUnique(false);
      // Generate a new tokenId and refetch the check
      const newId = generateRandomTokenId();
      setTokenId(newId);
      refetch();
    }
  }, [data, tokenId, isLoading, refetch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isConnected || !address) {
      setError("Please connect your wallet before minting.");
      return;
    }

    setLoading(true);
    setError(null);

    const tokenId = generateRandomTokenId();
    setTokenId(tokenId);

    const nftData: NFTData = {
      nftId: tokenId,
      name: formData.name,
      description: formData.description,
      logoUrl: formData.logoUrl,
      userWalletAddress: address,
    };

    try {
      const response = await fetch(
        "https://nft-mint-deployment.onrender.com/api/nft",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nftData),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to store NFT metadata.");
      }
      const data = await response.json();
      setStoredNFT(data);

      // Mint the NFT
      const metadataUrl = data.metadataUrl;
      const receipt = await writeContract({
        abi: contractABI,
        address: contractAddress,
        functionName: "mint",
        args: [tokenId, metadataUrl],
      });

      console.log("Minting successful, receipt:", receipt);
      setIsSuccess(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Error during minting process:", err);
        setError(err.message || "An error occurred while minting the NFT.");
      } else {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!hasMounted) return null;

  if (isSuccess && storedNFT) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-2xl p-6 border border-emerald-500/20">
          <div className="flex flex-col items-center text-center mb-6">
            <div className="w-12 h-12 bg-emerald-900/50 rounded-full flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-emerald-400 mb-2">
              NFT Minted Successfully!
            </h2>
            <p className="text-slate-400">
              Your NFT has been created and added to your collection.
            </p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gradient-to-r from-pink-500 to-purple-600" />
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">NFT Name</p>
                <p className="text-lg font-semibold text-white">
                  {storedNFT ? storedNFT.name : "NFT Name Unavailable"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">Description</p>
                <p className="text-white">
                  {storedNFT
                    ? storedNFT.description
                    : "Description Unavailable"}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-400">NFT ID</p>
                <p className="font-mono text-purple-400">
                  {storedNFT ? storedNFT.nftId : "NftId Unavailable"}
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full border-slate-700 text-white hover:bg-slate-800"
            >
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              Mint Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center pt-1 p-4">
      <div className="w-full max-w-md bg-slate-900/50 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Mint Your NFT</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nftName" className="text-slate-200">
              NFT Name
            </Label>
            <Input
              id="nftName"
              placeholder="Enter NFT name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="text-slate-200">
              Description
            </Label>
            <Textarea
              id="description"
              placeholder="Describe your NFT"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 min-h-[100px]"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-slate-200">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              type="url"
              placeholder="Enter image URL"
              value={formData.logoUrl}
              onChange={(e) =>
                setFormData({ ...formData, logoUrl: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white h-12"
          >
            {loading ? "Minting NFT..." : "Mint NFT"}
          </Button>
        </form>
      </div>
    </div>
  );
}
