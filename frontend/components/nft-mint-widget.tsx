"use client";

import React, { useState, useEffect } from "react";
import { useAccount, useReadContract } from "wagmi";
import contractABI from "././../constants/nftContractAbi.json";

const contractAddress = "0x743F49311A82fe72eb474c44e78Da2A6e0AE951c";

interface NFTData {
  nftId: number;
  name: string;
  description: string;
  logoUrl: string;
  userWalletAddress: string;
}

export default function NftMintWidget() {
  const { address, isConnected } = useAccount();
  const [tokenId, setTokenId] = useState<number>(0);
  const [isUnique, setIsUnique] = useState<boolean | null>(null);

  const [formData, setFormData] = useState<
    Omit<NFTData, "nftId" | "userWalletAddress">
  >({
    name: "",
    description: "",
    logoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [storedNFT, setStoredNFT] = useState<NFTData | null>(null);
  const [error, setError] = useState<string | null>(null);

  console.log("user wallet::", address);

  // Helper: generate a random token ID (for example, a random number between 1 and 1,000,000)
  const generateRandomTokenId = () => Math.floor(Math.random() * 1_000_000) + 1;
  console.log("random token id::", generateRandomTokenId());

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
    } catch (err: any) {
      console.error("Error storing NFT data:", err);
      setError(err.message || "An error occurred while storing NFT metadata.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {isConnected ? (
        <div>
          <form>
            {/* Add your form fields here */}
            <div>
              <label htmlFor="nftName">NFT Name:</label>
              <input type="text" id="nftName" name="nftName" />
            </div>
            <div>
              <label htmlFor="nftDescription">NFT Description:</label>
              <input type="text" id="nftDescription" name="nftDescription" />
            </div>
            <button type="submit">Mint NFT</button>
            <h2>Generated Token ID: {tokenId}</h2>
            {isLoading && <p>Checking token ID...</p>}
            {isUnique === null && !isLoading && <p>Generating token ID...</p>}
            {isUnique === true && (
              <p style={{ color: "green" }}>
                This token ID is unique and available!
              </p>
            )}
            {isUnique === false && (
              <p style={{ color: "red" }}>
                Token ID already exists. Generating a new one...
              </p>
            )}
          </form>

          <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <h1 className="text-2xl font-bold mb-6">Store NFT Metadata</h1>
            <form
              onSubmit={handleSubmit}
              className="w-full max-w-md space-y-4 bg-slate-800 p-6 rounded-lg"
            >
              <div className="flex flex-col">
                <label htmlFor="name" className="text-slate-200">
                  NFT Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="p-2 bg-slate-700 text-white rounded"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="description" className="text-slate-200">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  className="p-2 bg-slate-700 text-white rounded min-h-[100px]"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="logoUrl" className="text-slate-200">
                  Logo URL
                </label>
                <input
                  id="logoUrl"
                  type="url"
                  value={formData.logoUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, logoUrl: e.target.value })
                  }
                  required
                  className="p-2 bg-slate-700 text-white rounded"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded"
              >
                {loading ? "Storing NFT Data..." : "Store NFT Data"}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500">{error}</p>}
            {storedNFT && (
              <div className="mt-6 p-4 bg-slate-700 rounded">
                <h2 className="text-xl font-bold text-green-400">
                  NFT Stored Successfully!
                </h2>
                <pre className="text-white">
                  {JSON.stringify(storedNFT, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      ) : (
        <p>Please connect your wallet to mint an NFT.</p>
      )}
    </div>
  );
}
