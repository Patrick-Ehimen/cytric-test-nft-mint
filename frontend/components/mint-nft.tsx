"use client";

import type React from "react";

import { useState } from "react";
import { Check, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface NFTData {
  name: string;
  description: string;
  imageUrl: string;
  id?: string;
}

export default function MintNFT() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<NFTData>({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [mintedNFT, setMintedNFT] = useState<NFTData | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate minting process
    try {
      // In a real app, this would be your minting logic
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const nftId = "#8F3E2A1D9C"; // This would normally come from the blockchain
      setMintedNFT({
        ...formData,
        id: nftId,
      });
      setIsSuccess(true);
    } catch (error) {
      console.error("Minting failed:", error);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
    });
  };

  if (isSuccess && mintedNFT) {
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
              Your NFT has been created and added to your collection
            </p>
          </div>

          <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
            <div className="aspect-video rounded-lg overflow-hidden mb-4 bg-gradient-to-r from-pink-500 to-purple-600" />

            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-400">NFT Name</p>
                <p className="text-lg font-semibold text-white">
                  {mintedNFT.name}
                </p>
              </div>

              <div>
                <p className="text-sm text-slate-400">Description</p>
                <p className="text-white">{mintedNFT.description}</p>
              </div>

              <div>
                <p className="text-sm text-slate-400">NFT ID</p>
                <p className="font-mono text-purple-400">{mintedNFT.id}</p>
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
              value={formData.imageUrl}
              onChange={(e) =>
                setFormData({ ...formData, imageUrl: e.target.value })
              }
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white h-12"
          >
            Mint NFT
          </Button>
        </form>
      </div>
    </div>
  );
}
