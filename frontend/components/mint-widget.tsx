"use client";

import React, { useState } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import contractABI from "././../constants/nftContractAbi.json";
import { NextPage } from "next";

const contractAddress = "0x743F49311A82fe72eb474c44e78Da2A6e0AE951c";

const MintWidget: NextPage = () => {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient(); // For read-only calls via viem
  const { data: walletClient } = useWalletClient(); // For sending transactions

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState<number | null>(null);
  const [error, setError] = useState("");

  // Helper: generate a random token ID (for example, a random number between 1 and 1,000,000)
  const generateRandomTokenId = () => Math.floor(Math.random() * 1_000_000) + 1;

  // Check via the smart contract if a token ID already exists
  const checkIfTokenExists = async (tokenId: number): Promise<boolean> => {
    try {
      const exists = await publicClient.readContract({
        address: contractAddress,
        abi: contractABI,
        functionName: "checkId",
        args: [tokenId],
      });
      return exists as boolean;
    } catch (err) {
      console.error("Error checking token ID:", err);
      throw new Error("Failed to check token ID");
    }
  };

  // Generate a unique token ID by repeatedly checking until a non-existing ID is found
  const getUniqueTokenId = async (): Promise<number> => {
    let tokenId = generateRandomTokenId();
    let exists = await checkIfTokenExists(tokenId);
    while (exists) {
      tokenId = generateRandomTokenId();
      exists = await checkIfTokenExists(tokenId);
    }
    return tokenId;
  };

  // Handle minting process when the form is submitted
  const handleMint = async () => {
    if (!isConnected || !walletClient) {
      setError("Please connect your wallet.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // 1. Generate a unique token ID
      const tokenId = await getUniqueTokenId();

      // 2. Call the backend API to store NFT metadata
      const storeResponse = await fetch("/api/nft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Although our backend now generates the ID automatically in the storeNFT endpoint,
          // we’re using our unique tokenId here for consistency with the smart contract.
          nftId: tokenId,
          name,
          description,
          logoUrl,
          userWalletAddress: address,
        }),
      });
      if (!storeResponse.ok) {
        throw new Error("Failed to store NFT data in backend.");
      }
      const storedNFT = await storeResponse.json();

      // 3. Construct metadata URL pointing to the stored NFT data.
      // You can set NEXT_PUBLIC_API_BASE_URL in your .env file (e.g., http://localhost:3000)
      const metadataUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/nft/${tokenId}`;

      // 4. Write transaction: call the mint function on the smart contract
      const { request } = await walletClient.prepareContractWrite({
        address: contractAddress,
        abi: contractABI,
        functionName: "mint",
        args: [tokenId, metadataUrl],
      });

      // Send the transaction
      const txHash = await walletClient.writeContract(request);
      console.log("Mint transaction hash:", txHash);
      setMintedTokenId(tokenId);
    } catch (err: any) {
      console.error("Minting failed:", err);
      setError(err.message || "Minting failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 500,
        margin: "2rem auto",
        padding: "1rem",
        border: "1px solid #ddd",
        borderRadius: "8px",
      }}
    >
      <h2>Mint NFT</h2>
      {!isConnected && <p>Please connect your wallet to mint an NFT.</p>}
      {isConnected && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleMint();
          }}
        >
          <div style={{ marginBottom: "1rem" }}>
            <label>NFT Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>NFT Description:</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Image URL:</label>
            <input
              type="text"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              required
              style={{ width: "100%", padding: "0.5rem" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: "0.75rem 1.5rem" }}
          >
            {loading ? "Minting..." : "Mint NFT"}
          </button>
        </form>
      )}
      {mintedTokenId && (
        <p style={{ marginTop: "1rem", color: "green" }}>
          NFT minted successfully with Token ID: {mintedTokenId}
        </p>
      )}
      {error && (
        <p style={{ marginTop: "1rem", color: "red" }}>Error: {error}</p>
      )}
    </div>
  );
};

export default MintWidget;
