import { Request, Response } from "express";
import NFT from "../models/nft.model";

export const storeNFT = async (req: Request, res: Response) => {
  try {
    const { name, description, logoUrl, userWalletAddress } = req.body;

    const nftId = Date.now();

    const nft = new NFT({
      nftId,
      name,
      description,
      logoUrl,
      userWalletAddress,
    });
    await nft.save();
    res.status(201).json({ message: "NFT data stored successfully" });
  } catch (error) {
    console.error("Error storing NFT:", error);
    res.status(500).json({ error: "Failed to store NFT data" });
  }
};

export const getNFTById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const nftId = Number(id);

    // Validate that the conversion was successful
    if (isNaN(nftId)) {
      res.status(400).json({ error: "Invalid NFT ID. It must be a number." });
      return;
    }

    const nft = await NFT.findOne({ nftId });
    if (!nft) {
      res.status(404).json({ error: "NFT not found" });
      return;
    }
    res.status(200).json(nft);
  } catch (error) {
    console.error("Error retrieving NFT:", error);
    res.status(500).json({ error: "Failed to retrieve NFT data" });
  }
};

export const getNFTGallery = async (req: Request, res: Response) => {
  try {
    const { userWalletAddress } = req.params;
    const nfts = await NFT.find({ userWalletAddress });
    res.status(200).json(nfts);
  } catch (error) {
    console.error(
      `Error retrieving NFT gallery for userWalletAddress ${req.params.userWalletAddress}:`,
      error
    );
    res.status(500).json({ error: "Failed to retrieve NFT gallery" });
  }
};
